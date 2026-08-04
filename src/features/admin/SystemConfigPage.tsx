import { motion } from 'framer-motion'
import { Sliders, Database, Mail, Shield } from 'lucide-react'
import { Card } from '@/components/ui/Card'
import { Button } from '@/components/ui/Button'

export default function SystemConfigPage() {
  const sections = [
    { icon: Database, title: 'Database', description: 'View database status and manage maintenance tasks.' },
    { icon: Mail, title: 'Email Templates', description: 'Configure email templates for notifications and confirmations.' },
    { icon: Shield, title: 'Security Settings', description: 'Manage authentication, rate limiting, and access controls.' },
    { icon: Sliders, title: 'Feature Flags', description: 'Toggle features and manage platform configuration.' },
  ]

  return (
    <div className="p-6 lg:p-10 max-w-4xl mx-auto">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
        <p className="eyebrow text-champagne-700 mb-2">Super Admin</p>
        <h1 className="font-display text-display-2 text-charcoal-900 mb-8">System Configuration</h1>
      </motion.div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
        {sections.map((section, i) => (
          <motion.div key={section.title} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4, delay: i * 0.08 }}>
            <Card className="hover:shadow-card transition-all">
              <div className="flex items-center gap-3 mb-3">
                <div className="flex items-center justify-center h-10 w-10 rounded-lg bg-champagne-50 text-champagne-600">
                  <section.icon className="h-5 w-5" />
                </div>
                <h3 className="font-display text-lg text-charcoal-900">{section.title}</h3>
              </div>
              <p className="text-sm text-charcoal-500 mb-4">{section.description}</p>
              <Button variant="outline" size="sm">Configure</Button>
            </Card>
          </motion.div>
        ))}
      </div>
    </div>
  )
}
