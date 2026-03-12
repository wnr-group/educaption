import { Star, Quote } from 'lucide-react'
import { useTranslation } from 'react-i18next'

const testimonials = [
  {
    name: 'Priya Lakshmi',
    role: 'B.E Computer Science',
    college: 'Anna University',
    image: 'https://placehold.co/80x80/FF6B35/FFFFFF?text=PL',
    quote: 'I had no idea which courses I was eligible for. Educaption showed me 12 options I never knew existed. Now I\'m studying my dream subject!',
    rating: 5
  },
  {
    name: 'Karthik Raja',
    role: 'B.Tech IT',
    college: 'PSG College',
    image: 'https://placehold.co/80x80/7B4AE2/FFFFFF?text=KR',
    quote: 'The counselling reminders saved me. I almost missed the document submission deadline. Got a WhatsApp alert just in time.',
    rating: 5
  },
  {
    name: 'Meenakshi S',
    role: 'Parent',
    college: '',
    image: 'https://placehold.co/80x80/00D4AA/FFFFFF?text=MS',
    quote: 'As a first-generation college parent, I was lost. This website explained everything in Tamil. My son got into a government college!',
    rating: 5
  }
]

export default function TestimonialsSection() {
  const { t } = useTranslation()

  return (
    <section className="relative py-20 sm:py-28 bg-[#0A0A0F] overflow-hidden">
      {/* Background elements */}
      <div className="absolute top-0 left-1/4 w-[400px] h-[400px] bg-[#FF6B35] rounded-full blur-[150px] opacity-[0.05]" />
      <div className="absolute bottom-0 right-1/4 w-[300px] h-[300px] bg-[#7B4AE2] rounded-full blur-[120px] opacity-[0.05]" />

      <div className="relative z-10 max-w-6xl mx-auto px-5 sm:px-8">
        {/* Section header */}
        <div className="text-center mb-14 sm:mb-16">
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-white/[0.05] border border-white/[0.08] rounded-full mb-6">
            <span className="text-sm font-semibold text-white/60 uppercase tracking-wider">
              Real Stories
            </span>
          </div>
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-black text-white tracking-tight mb-4">
            Students who found their path
          </h2>
          <p className="text-lg text-white/40 max-w-xl mx-auto">
            Join thousands of Tamil Nadu students who discovered their future
          </p>
        </div>

        {/* Testimonials grid */}
        <div className="grid md:grid-cols-3 gap-6 sm:gap-8">
          {testimonials.map((testimonial, i) => (
            <div
              key={i}
              className="
                relative
                bg-white/[0.03]
                backdrop-blur-sm
                border border-white/[0.06]
                rounded-3xl
                p-6 sm:p-8
                transition-all duration-500
                hover:bg-white/[0.05]
                hover:border-white/[0.1]
              "
            >
              {/* Quote mark */}
              <Quote className="absolute top-6 right-6 w-10 h-10 text-white/[0.06]" />

              {/* Stars */}
              <div className="flex gap-1 mb-5">
                {[...Array(testimonial.rating)].map((_, j) => (
                  <Star
                    key={j}
                    className="w-4 h-4 text-[#FFB347] fill-[#FFB347]"
                  />
                ))}
              </div>

              {/* Quote text */}
              <p className="text-white/70 leading-relaxed mb-8 text-[15px] sm:text-base">
                "{testimonial.quote}"
              </p>

              {/* Author */}
              <div className="flex items-center gap-4">
                <img
                  src={testimonial.image}
                  alt={testimonial.name}
                  className="w-12 h-12 rounded-full object-cover ring-2 ring-white/10"
                />
                <div>
                  <p className="font-bold text-white/90">
                    {testimonial.name}
                  </p>
                  <p className="text-sm text-white/40">
                    {testimonial.role}{testimonial.college && `, ${testimonial.college}`}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Trust metric */}
        <div className="mt-14 sm:mt-16 text-center">
          <div className="inline-flex items-center gap-4 px-6 py-4 bg-white/[0.03] border border-white/[0.06] rounded-2xl">
            <div className="flex -space-x-2">
              {['#FF6B35', '#7B4AE2', '#00D4AA', '#3B82F6'].map((color, i) => (
                <div
                  key={i}
                  className="w-8 h-8 rounded-full border-2 border-[#0A0A0F]"
                  style={{ backgroundColor: color }}
                />
              ))}
            </div>
            <div className="text-left">
              <p className="text-white/90 font-bold">10,000+ students</p>
              <p className="text-xs text-white/40">found their path this year</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
