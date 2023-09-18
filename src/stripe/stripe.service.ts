import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma.service';
import { absoluteUrl } from 'src/utils/absoluteURL';
import { Response } from 'express';
import Stripe from 'stripe';

interface IPars {
    userId: string;
    email: string;
}

const settingsUrl = absoluteUrl('/settings');

@Injectable()
export class StripeService {
    private stripe: Stripe;

    constructor(private prisma: PrismaService) {
        this.stripe = new Stripe(process.env.STRIPE_API, {
            apiVersion: '2023-08-16',
            typescript: true
        });
    }

    async paymentUrl(reply: Response, pars: IPars): Promise<Response> {
        const { userId, email } = pars;

        try {
            if (!userId) {
                reply.status(401).send({ error: 'Unauthorized' });
            }

            const userSubscription = await this.prisma.userSubscription.findUnique({
                where: {
                    userId
                }
            })

            if (userSubscription && userSubscription.stripeCustomerId) {
                const stripeSession = await this.stripe.billingPortal.sessions.create({
                    customer: userSubscription.stripeCustomerId,
                    return_url: settingsUrl,
                })

                reply.send(JSON.stringify({ url: stripeSession.url }));
            }

            const stripeSession = await this.stripe.checkout.sessions.create({
                success_url: settingsUrl,
                cancel_url: settingsUrl,
                payment_method_types: ["card"],
                mode: "subscription",
                billing_address_collection: "auto",
                customer_email: email,
                line_items: [
                    {
                        price_data: {
                            currency: "BRL",
                            product_data: {
                                name: "Genius Pro",
                                description: "Gerações ilimitadas de IA"
                            },
                            unit_amount: 2000,
                            recurring: {
                                interval: "month"
                            }
                        },
                        quantity: 1,
                    },
                ],
                metadata: {
                    userId,
                },
            })

            return reply.status(200).send({
                url: stripeSession.url
            });
        } catch (error) {
            console.log(error);
            reply.status(500).send({ error: "Internal error" });
        }
    }
}