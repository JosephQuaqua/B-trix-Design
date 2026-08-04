import { motion } from 'framer-motion'
import { Link } from 'react-router-dom'
import { Button } from '@/components/ui/Button'

const atelierImage = 'https://images.pexels.com/photos/6358787/pexels-photo-6358787.jpeg?auto=compress&cs=tinysrgb&w=1000'
const sketchImage = 'https://images.pexels.com/photos/9849312/pexels-photo-9849312.jpeg?auto=compress&cs=tinysrgb&w=800'

export function DesignerStory() {
  return (
    <section className="py-24 bg-charcoal-900 text-ivory-100 overflow-hidden">
      <div className="container-luxury">
        <div className="grid lg:grid-cols-2 gap-16 items-center">
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: '-100px' }}
            transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
            className="relative"
          >
            <div className="relative aspect-[4/5] rounded-lg overflow-hidden">
              <img src={atelierImage} alt="Atelier craftsmanship" className="h-full w-full object-cover" loading="lazy" />
            </div>
            <div className="absolute -bottom-8 -right-4 lg:-right-8 w-40 h-52 rounded-lg overflow-hidden border-4 border-charcoal-900 hidden sm:block">
              <img src={sketchImage} alt="Design sketches" className="h-full w-full object-cover" loading="lazy" />
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: '-100px' }}
            transition={{ duration: 0.7, delay: 0.1, ease: [0.22, 1, 0.36, 1] }}
          >
            <p className="eyebrow text-champagne-300 mb-4">Our Story</p>
            <h2 className="font-display text-display-2 text-ivory-50 leading-tight">
              A Heritage of<br />Craftsmanship
            </h2>
            <p className="mt-6 text-ivory-300 leading-relaxed text-lg">
              B'trix Design was born from a passion for blending timeless bridal elegance with the rich cultural heritage of Liberia. Every stitch tells a story, and every gown is a canvas where tradition meets modern luxury.
            </p>
            <p className="mt-4 text-ivory-400 leading-relaxed">
              From the first sketch to the final fitting, our atelier is dedicated to creating garments that celebrate the individuality of each bride. We believe your wedding dress should be as unique as your love story.
            </p>
            <div className="mt-8">
              <Link to="/about">
                <Button variant="gold">Discover Our Journey</Button>
              </Link>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  )
}
