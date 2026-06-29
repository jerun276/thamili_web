import { getTranslations } from "next-intl/server";
import { Mail, Phone, MapPin, Clock } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export default async function ContactPage() {
  return (
    <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
      <div className="text-center">
        <h1 className="text-3xl font-bold text-gray-900 sm:text-4xl">Contact Us</h1>
        <p className="mx-auto mt-4 max-w-2xl text-lg text-gray-600">
          Have questions or feedback? We'd love to hear from you.
        </p>
      </div>

      <div className="mt-12 grid grid-cols-1 gap-12 lg:grid-cols-2">
        {/* Contact Info */}
        <div>
          <h2 className="text-xl font-semibold text-gray-900">Get in Touch</h2>
          <p className="mt-2 text-gray-600">
            Reach out to us through any of the following channels and we'll get back to you as soon as possible.
          </p>

          <div className="mt-8 space-y-6">
            <div className="flex items-start gap-4">
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-green-100">
                <Mail className="h-5 w-5 text-green-700" />
              </div>
              <div>
                <p className="font-medium text-gray-900">Email</p>
                <p className="text-sm text-gray-600">support@thamili.app</p>
              </div>
            </div>

            <div className="flex items-start gap-4">
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-green-100">
                <Phone className="h-5 w-5 text-green-700" />
              </div>
              <div>
                <p className="font-medium text-gray-900">Phone</p>
                <p className="text-sm text-gray-600">+49 123 456 7890</p>
              </div>
            </div>

            <div className="flex items-start gap-4">
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-green-100">
                <MapPin className="h-5 w-5 text-green-700" />
              </div>
              <div>
                <p className="font-medium text-gray-900">Location</p>
                <p className="text-sm text-gray-600">Germany & Denmark</p>
              </div>
            </div>

            <div className="flex items-start gap-4">
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-green-100">
                <Clock className="h-5 w-5 text-green-700" />
              </div>
              <div>
                <p className="font-medium text-gray-900">Business Hours</p>
                <p className="text-sm text-gray-600">Mon - Sat: 8:00 AM - 8:00 PM</p>
                <p className="text-sm text-gray-600">Sun: 10:00 AM - 6:00 PM</p>
              </div>
            </div>
          </div>
        </div>

        {/* Contact Form */}
        <Card>
          <CardContent className="pt-6">
            <form className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="firstName">First Name</Label>
                  <Input id="firstName" name="firstName" required />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="lastName">Last Name</Label>
                  <Input id="lastName" name="lastName" required />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input id="email" name="email" type="email" required />
              </div>

              <div className="space-y-2">
                <Label htmlFor="phone">Phone (optional)</Label>
                <Input id="phone" name="phone" type="tel" />
              </div>

              <div className="space-y-2">
                <Label htmlFor="subject">Subject</Label>
                <select
                  id="subject"
                  name="subject"
                  className="flex h-10 w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm"
                >
                  <option value="general">General Inquiry</option>
                  <option value="order">Order Issue</option>
                  <option value="delivery">Delivery Question</option>
                  <option value="product">Product Request</option>
                  <option value="feedback">Feedback</option>
                </select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="message">Message</Label>
                <textarea
                  id="message"
                  name="message"
                  rows={4}
                  required
                  className="flex w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-green-500"
                />
              </div>

              <Button type="submit" className="w-full">
                Send Message
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
