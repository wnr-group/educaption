import { Star, Quote } from 'lucide-react'
import { useTranslation } from 'react-i18next'
import Card from '../ui/Card'

export default function TestimonialsSection() {
  const { t } = useTranslation()

  const testimonials = [
    {
      name: 'Priya Lakshmi',
      role: 'B.E Computer Science, Anna University',
      image: 'https://placehold.co/80x80/F97316/FFFFFF?text=PL',
      quoteKey: 'home.testimonials.quotes.quote1',
      rating: 5
    },
    {
      name: 'Karthik Raja',
      role: 'B.Tech IT, PSG College',
      image: 'https://placehold.co/80x80/334E68/FFFFFF?text=KR',
      quoteKey: 'home.testimonials.quotes.quote2',
      rating: 5
    },
    {
      name: 'Meenakshi S',
      roleKey: 'home.testimonials.roles.parent',
      image: 'https://placehold.co/80x80/10B981/FFFFFF?text=MS',
      quoteKey: 'home.testimonials.quotes.quote3',
      rating: 5
    }
  ]

  return (
    <section className="relative py-24 lg:py-32 bg-white overflow-hidden">
      {/* Background decoration */}
      <div className="absolute top-0 left-0 w-full h-full pattern-kolam opacity-30" />
      <div className="absolute -top-40 -right-40 w-80 h-80 bg-saffron-100 rounded-full blur-3xl opacity-50" />
      <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-navy-100 rounded-full blur-3xl opacity-30" />

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center mb-16">
          <h2 className="
            font-display text-4xl sm:text-5xl lg:text-6xl
            font-bold
            text-navy-900
            tracking-tighter
            mb-6
          ">
            {t('home.testimonials.title')} <span className="text-gradient">{t('home.testimonials.titleHighlight')}</span>
          </h2>
          <p className="
            font-body text-lg
            text-navy-500
            max-w-2xl mx-auto
          ">
            {t('home.testimonials.subtitle')}
          </p>
        </div>

        {/* Testimonials Grid */}
        <div className="grid md:grid-cols-3 gap-8">
          {testimonials.map((testimonial, i) => (
            <Card
              key={i}
              variant="gradient"
              padding="lg"
              className="relative"
            >
              {/* Quote Icon */}
              <div className="absolute top-6 right-6">
                <Quote className="w-10 h-10 text-saffron-200" />
              </div>

              {/* Stars */}
              <div className="flex gap-1 mb-6">
                {[...Array(testimonial.rating)].map((_, j) => (
                  <Star key={j} className="w-5 h-5 text-saffron-400 fill-saffron-400" />
                ))}
              </div>

              {/* Quote */}
              <p className="
                font-body text-navy-700
                leading-relaxed
                mb-8
                text-lg
              ">
                "{t(testimonial.quoteKey)}"
              </p>

              {/* Author */}
              <div className="flex items-center gap-4">
                <img
                  src={testimonial.image}
                  alt={testimonial.name}
                  className="w-14 h-14 rounded-full object-cover border-2 border-saffron-200"
                />
                <div>
                  <p className="font-display font-bold text-navy-900">
                    {testimonial.name}
                  </p>
                  <p className="font-body text-sm text-navy-500">
                    {testimonial.roleKey ? t(testimonial.roleKey) : testimonial.role}
                  </p>
                </div>
              </div>
            </Card>
          ))}
        </div>
      </div>
    </section>
  )
}
