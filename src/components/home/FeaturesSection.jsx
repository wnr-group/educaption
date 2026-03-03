import { BookOpen, School, Users, FileText } from 'lucide-react'
import Card from '../ui/Card'

export default function FeaturesSection() {
  const features = [
    {
      icon: BookOpen,
      title: 'Calculate Cutoff',
      description: 'Enter your marks and instantly see your cutoff scores'
    },
    {
      icon: School,
      title: 'Discover Courses',
      description: 'Explore all eligible courses based on your stream'
    },
    {
      icon: Users,
      title: 'Find Colleges',
      description: 'Browse government and private colleges near you'
    },
    {
      icon: FileText,
      title: 'Counselling Guide',
      description: 'Complete step-by-step guidance for TNEA counselling'
    }
  ]

  return (
    <section className="py-16 bg-bg">
      <div className="max-w-7xl mx-auto px-4">
        <h2 className="text-3xl font-bold text-center mb-12">How It Works</h2>
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
          {features.map((feature, i) => (
            <Card key={i}>
              <feature.icon className="w-12 h-12 text-primary mb-4" />
              <h3 className="font-bold text-lg mb-2">{feature.title}</h3>
              <p className="text-slate-600 text-sm">{feature.description}</p>
            </Card>
          ))}
        </div>
      </div>
    </section>
  )
}
