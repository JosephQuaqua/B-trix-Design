import { motion } from 'framer-motion'
import { Bell, Lock, Globe } from 'lucide-react'
import { Card } from '@/components/ui/Card'
import { Button } from '@/components/ui/Button'

export default function SettingsPage() {
  return (
    <div className="p-6 lg:p-10 max-w-2xl mx-auto">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
        <p className="eyebrow text-champagne-700 mb-2">Dashboard</p>
        <h1 className="font-display text-display-2 text-charcoal-900 mb-8">Settings</h1>
      </motion.div>

      <div className="space-y-6">
        <Card>
          <div className="flex items-center gap-3 mb-4">
            <Bell className="h-5 w-5 text-champagne-600" />
            <h3 className="font-display text-lg text-charcoal-900">Notifications</h3>
          </div>
          <p className="text-charcoal-500 text-sm mb-4">Manage how you receive appointment updates and reminders.</p>
          <div className="space-y-3">
            <label className="flex items-center justify-between cursor-pointer">
              <span className="text-sm text-charcoal-700">Email notifications</span>
              <input type="checkbox" defaultChecked className="accent-champagne-500" />
            </label>
            <label className="flex items-center justify-between cursor-pointer">
              <span className="text-sm text-charcoal-700">Appointment reminders</span>
              <input type="checkbox" defaultChecked className="accent-champagne-500" />
            </label>
          </div>
        </Card>

        <Card>
          <div className="flex items-center gap-3 mb-4">
            <Lock className="h-5 w-5 text-champagne-600" />
            <h3 className="font-display text-lg text-charcoal-900">Security</h3>
          </div>
          <p className="text-charcoal-500 text-sm mb-4">Manage your password and account security.</p>
          <Button variant="outline" size="sm">Change Password</Button>
        </Card>

        <Card>
          <div className="flex items-center gap-3 mb-4">
            <Globe className="h-5 w-5 text-champagne-600" />
            <h3 className="font-display text-lg text-charcoal-900">Privacy</h3>
          </div>
          <p className="text-charcoal-500 text-sm mb-4">Control your data and privacy preferences.</p>
          <Button variant="outline" size="sm">Download My Data</Button>
        </Card>
      </div>
    </div>
  )
}
