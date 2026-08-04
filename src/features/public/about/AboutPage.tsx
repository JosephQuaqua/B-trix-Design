import { motion } from 'framer-motion'
import { Heart, Sparkles, Award, Users } from 'lucide-react'

const atelierImage = 'https://images.pexels.com/photos/3984870/pexels-photo-3984870.jpeg?auto=compress&cs=tinysrgb&w=1200'
const fittingImage = 'https://images.pexels.com/photos/9388518/pexels-photo-9388518.jpeg?auto=compress&cs=tinysrgb&w=1200'

const values = [
  { icon: Heart, title: 'Passion-Driven', description: 'Every garment is crafted with genuine love for the art of fashion design.' },
  { icon: Sparkles, title: 'Attention to Detail', description: 'We obsess over every seam, every bead, every drape until perfection is achieved.' },
  { icon: Award, title: 'Premium Quality', description: 'Only the finest fabrics and materials are selected for our atelier creations.' },
  { icon: Users, title: 'Client-Centered', description: 'Your vision guides our work. We listen, we advise, and we deliver your dream.' },
]

export default function AboutPage() {
  return (
    <>
      <section className="pt-32 pb-16 bg-gradient-hero">
        <div className="container-luxury text-center">
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="eyebrow text-champagne-700 mb-4"
          >
            About B'trix Design
          </motion.p>
          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.1 }}
            className="font-display text-display-1 text-charcoal-900 max-w-3xl mx-auto text-balance"
          >
            Where Elegance Meets Craftsmanship
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.2 }}
            className="mt-6 max-w-2xl mx-auto text-lg text-charcoal-500 leading-relaxed"
          >
            B'trix Design is a luxury bridal fashion studio dedicated to creating timeless, culturally rich, and individually crafted wedding attire.
          </motion.p>
        </div>
      </section>

      <section className="py-20 bg-ivory-50">
        <div className="container-luxury">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.7 }}
              className="relative aspect-[4/3] rounded-lg overflow-hidden"
            >
              <img src={atelierImage} alt="B'trix Design atelier" className="h-full w-full object-cover" loading="lazy" />
            </motion.div>
            <motion.div
              initial={{ opacity: 0, x: 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.7, delay: 0.1 }}
            >
              <p className="eyebrow text-champagne-700 mb-4">Our Story</p>
              <h2 className="font-display text-display-2 text-charcoal-900 mb-6">A Studio Born from Passion</h2>
              <p className="text-charcoal-600 leading-relaxed mb-4">
                B'trix Design was founded with a singular vision: to create a space where bridal elegance and cultural heritage converge. Our studio specializes in white wedding dresses and authentic Liberian traditional wedding attire, each piece crafted with meticulous attention to detail.
              </p>
              <p className="text-charcoal-600 leading-relaxed mb-4">
                We believe that every bride deserves a dress that tells her unique story. Whether you envision a classic ivory gown or a vibrant celebration of Liberian heritage, our atelier brings your vision to life with unparalleled craftsmanship.
              </p>
              <p className="text-charcoal-600 leading-relaxed">
                From custom fashion design to expert alterations, our services are designed to make you feel confident, beautiful, and uniquely yourself on your special day.
              </p>
            </motion.div>
          </div>
        </div>
      </section>

      <section className="py-20 bg-gradient-ivory">
        <div className="container-luxury">
          <div className="text-center mb-16">
            <p className="eyebrow text-champagne-700 mb-4">Our Values</p>
            <h2 className="font-display text-display-2 text-charcoal-900">What Guides Us</h2>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {values.map((value, i) => (
              <motion.div
                key={value.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: i * 0.1 }}
                className="text-center p-8 card-luxury"
              >
                <div className="inline-flex items-center justify-center h-14 w-14 rounded-lg bg-champagne-50 text-champagne-600 mb-5">
                  <value.icon className="h-7 w-7" />
                </div>
                <h3 className="font-display text-xl text-charcoal-900 mb-2">{value.title}</h3>
                <p className="text-charcoal-500 text-sm leading-relaxed">{value.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-20 bg-ivory-50">
        <div className="container-luxury">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.7 }}
              className="order-2 lg:order-1"
            >
              <p className="eyebrow text-champagne-700 mb-4">The Atelier</p>
              <h2 className="font-display text-display-2 text-charcoal-900 mb-6">Craftsmanship in Every Stitch</h2>
              <p className="text-charcoal-600 leading-relaxed mb-4">
                Our atelier is where magic happens. Every garment is hand-crafted by skilled artisans who take pride in their work. From the initial sketch to the final fitting, each step is executed with precision and care.
              </p>
              <p className="text-charcoal-600 leading-relaxed">
                We source only the finest fabrics — French lace, pure silk, authentic Liberian country cloth — and combine them with techniques passed down through generations of master tailors.
              </p>
            </motion.div>
            <motion.div
              initial={{ opacity: 0, x: 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.7, delay: 0.1 }}
              className="order-1 lg:order-2 relative aspect-[4/3] rounded-lg overflow-hidden"
            >
              <img src={fittingImage} alt="Dress fitting at the atelier" className="h-full w-full object-cover" loading="lazy" />
            </motion.div>
          </div>
        </div>
      </section>
    </>
  )
}
