import { getTranslations } from "next-intl/server";
import { Leaf, Truck, Users, Heart } from "lucide-react";

export default async function AboutPage() {
  return (
    <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
      {/* Hero */}
      <div className="text-center">
        <h1 className="text-3xl font-bold text-gray-900 sm:text-4xl">About Thamili</h1>
        <p className="mx-auto mt-4 max-w-2xl text-lg text-gray-600">
          Bringing the freshest fish and vegetables from trusted suppliers directly to Tamil communities in Germany and Denmark.
        </p>
      </div>

      {/* Story */}
      <div className="mt-16 max-w-3xl mx-auto">
        <h2 className="text-2xl font-bold text-gray-900">Our Story</h2>
        <p className="mt-4 text-gray-600 leading-relaxed">
          Thamili was founded with a simple mission: to make it easy for Tamil families living in Germany and Denmark to access the fresh fish, vegetables, and groceries they love. We understand how important authentic ingredients are for preparing traditional meals, and we work directly with suppliers to deliver quality produce to your doorstep.
        </p>
        <p className="mt-4 text-gray-600 leading-relaxed">
          Whether it's fresh seafood for a weekend feast or everyday vegetables for your kitchen, Thamili ensures you get handpicked quality without the hassle of searching multiple shops.
        </p>
      </div>

      {/* Values */}
      <div className="mt-16">
        <h2 className="text-center text-2xl font-bold text-gray-900">What We Stand For</h2>
        <div className="mt-8 grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-4">
          <div className="text-center">
            <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-green-100">
              <Leaf className="h-7 w-7 text-green-700" />
            </div>
            <h3 className="mt-4 text-sm font-semibold text-gray-900">Freshness First</h3>
            <p className="mt-2 text-sm text-gray-500">Every product is handpicked for quality and freshness before delivery.</p>
          </div>
          <div className="text-center">
            <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-green-100">
              <Truck className="h-7 w-7 text-green-700" />
            </div>
            <h3 className="mt-4 text-sm font-semibold text-gray-900">Reliable Delivery</h3>
            <p className="mt-2 text-sm text-gray-500">Scheduled deliveries and pickup points across Germany and Denmark.</p>
          </div>
          <div className="text-center">
            <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-green-100">
              <Users className="h-7 w-7 text-green-700" />
            </div>
            <h3 className="mt-4 text-sm font-semibold text-gray-900">Community Focused</h3>
            <p className="mt-2 text-sm text-gray-500">Built by and for Tamil communities living abroad.</p>
          </div>
          <div className="text-center">
            <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-green-100">
              <Heart className="h-7 w-7 text-green-700" />
            </div>
            <h3 className="mt-4 text-sm font-semibold text-gray-900">Customer Care</h3>
            <p className="mt-2 text-sm text-gray-500">Your satisfaction matters. Easy returns and responsive support.</p>
          </div>
        </div>
      </div>

      {/* Stats */}
      <div className="mt-16 rounded-2xl bg-green-900 px-8 py-12 text-white">
        <div className="grid grid-cols-2 gap-8 text-center md:grid-cols-4">
          <div>
            <p className="text-3xl font-bold">2</p>
            <p className="mt-1 text-sm text-green-200">Countries</p>
          </div>
          <div>
            <p className="text-3xl font-bold">50+</p>
            <p className="mt-1 text-sm text-green-200">Products</p>
          </div>
          <div>
            <p className="text-3xl font-bold">10+</p>
            <p className="mt-1 text-sm text-green-200">Pickup Points</p>
          </div>
          <div>
            <p className="text-3xl font-bold">1000+</p>
            <p className="mt-1 text-sm text-green-200">Happy Customers</p>
          </div>
        </div>
      </div>
    </div>
  );
}
