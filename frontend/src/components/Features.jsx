import React from 'react'
import { Truck, ShieldCheck, RefreshCcw, Headphones, Icon } from "lucide-react";

const featuresData = [
  {
    Icon: Truck,
    title: "Free Shipping",
    desc: "On orders over $100 worldwide",
    color: "from-cyan-400 to-blue-500",
  },


  {
    Icon: ShieldCheck,
    title: "Product Warranty",
    desc: "Free Returns or Exchanges within 14 Days",
    color: "from-green-400 to-emerald-500",
  },

  {
    Icon: RefreshCcw,
    title: "Easy Returns",
    desc: "Simple and Fast Process in Minutes",
    color: "from-purple-500 to-pink-500",
  },

  {
    Icon: Headphones,
    title: "24/7 Support",
    desc: "Our Team Is Ready to Assist You Anytime",
    color: "from-yellow-400 to-orange-500",
  },

];

const Features = () => {
  return (
    <section className='relative w-full bg-surface text-text-main py-24 border-y border-border-light'>
      <div className='relative z-10 max-w-7xl mx-auto px-6 sm:px-10 text-center'>
        <h2 className='text-4xl sm:text6-5xl font-extrabold mb-12'>
          Why Choose Us<span className="text-primary">?</span>

        </h2>

        <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8'>
          {
            featuresData.map(({ Icon, title, desc, color }, index) => (
              <div key={index} className={`bg-background border border-border-light rounded-3xl
      p-8 shadow-soft flex flex-col items-center text-center transition-transform 
      transform hover:-translate-y-1`}>
                <div className={`bg-surface border border-border-light
  w-20 h-20 rounded-2xl flex items-center justify-center shadow-sm mb-6`}
                >
                  <Icon className='w-10 h-10 text-primary' />
                </div>
                <h3 className='text-2xl font-bold mb-3'>{title}</h3>
                <p className='text-text-muted text-base'>{desc}</p>
              </div>
            ))
          }


        </div>

      </div>

    </section>
  )
}

export default Features;