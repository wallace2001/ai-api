import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma.service';
import { absoluteUrl } from 'src/utils/absoluteURL';
import { Response } from 'express';
import Stripe from 'stripe';
import _ from 'lodash';

interface IPars {
    id: string;
    email: string;
}

const settingsUrl = absoluteUrl('/settings');

@Injectable()
export class WebhookService {
    private stripe: Stripe;

    constructor(private prisma: PrismaService) {
        this.stripe = new Stripe(process.env.STRIPE_API, {
            apiVersion: '2023-08-16',
            typescript: true
        });
    }

    async webhookStripe(request: Request, reply: Response): Promise<void> {
        const body =  request.body;
        const signature = request.headers['stripe-signature'];

        let event: Stripe.Event;
        
        try {
            event = this.stripe.webhooks.constructEvent(
                body as any,
                signature,
                process.env.STRIPE_WEBHOOK_SECRET!
              )
        } catch (error) {
            reply.status(400).send({ error: `Webhook Error: ${error.message}` });
        }

        const session = event.data.object as Stripe.Checkout.Session

        if (event.type === "checkout.session.completed") {
          const subscription = await this.stripe.subscriptions.retrieve(
            session.subscription as string
          )
      
          if (!session?.metadata?.userId) {
            reply.status(400).send({error: "User id is required"});
          }
      
          await this.prisma.userSubscription.create({
            data: {
              userId: session?.metadata?.userId,
              stripeSubscriptionId: subscription.id,
              stripeCustomerId: subscription.customer as string,
              stripePriceId: subscription.items.data[0].price.id,
              stripeCurrentPeriodEnd: new Date(
                subscription.current_period_end * 1000
              ),
            },
          })
        }
      
        if (event.type === "invoice.payment_succeeded") {
          const subscription = await this.stripe.subscriptions.retrieve(
            session.subscription as string
          )
      
          await this.prisma.userSubscription.update({
            where: {
              stripeSubscriptionId: subscription.id,
            },
            data: {
              stripePriceId: subscription.items.data[0].price.id,
              stripeCurrentPeriodEnd: new Date(
                subscription.current_period_end * 1000
              ),
            },
          })
        }
      
        reply.status(200);
    }
}