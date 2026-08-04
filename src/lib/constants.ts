export type AppointmentStatus =
  | 'pending'
  | 'approved'
  | 'rejected'
  | 'cancelled'
  | 'completed'
  | 'no_show'

export const APPOINTMENT_STATUS_LABELS: Record<AppointmentStatus, string> = {
  pending: 'Pending',
  approved: 'Approved',
  rejected: 'Rejected',
  cancelled: 'Cancelled',
  completed: 'Completed',
  no_show: 'No Show',
}

export const APPOINTMENT_STATUS_COLORS: Record<AppointmentStatus, string> = {
  pending: 'bg-warning-50 text-warning-700 border-warning-500/30',
  approved: 'bg-success-50 text-success-700 border-success-500/30',
  rejected: 'bg-danger-50 text-danger-700 border-danger-500/30',
  cancelled: 'bg-charcoal-100 text-charcoal-500 border-charcoal-300',
  completed: 'bg-info-50 text-info-700 border-info-500/30',
  no_show: 'bg-charcoal-100 text-charcoal-500 border-charcoal-300',
}

export type CollectionCategory =
  | 'white_wedding'
  | 'liberian_traditional'
  | 'custom_fashion'
  | 'bridal_party'
  | 'evening_wear'
  | 'alterations'

export const COLLECTION_CATEGORIES: { value: CollectionCategory; label: string }[] = [
  { value: 'white_wedding', label: 'White Wedding' },
  { value: 'liberian_traditional', label: 'Liberian Traditional Wedding' },
  { value: 'custom_fashion', label: 'Custom Fashion' },
  { value: 'bridal_party', label: 'Bridal Party' },
  { value: 'evening_wear', label: 'Evening Wear' },
  { value: 'alterations', label: 'Alterations' },
]
