import { BellIcon, CheckIcon, ClockIcon, InboxIcon } from '../../../components/icons.jsx'

function DmStats({ stats }) {
  const cards = [
    { label: 'New brand DMs', value: stats.new, icon: BellIcon, tone: 'rose' },
    { label: 'Total brand DMs', value: stats.total, icon: InboxIcon, tone: 'violet' },
    { label: 'Awaiting reply', value: stats.awaiting, icon: ClockIcon, tone: 'amber' },
    { label: 'Replied', value: stats.replied, icon: CheckIcon, tone: 'green' },
  ]

  return (
    <div className="dm-stats">
      {cards.map(({ label, value, icon: Icon, tone }) => (
        <div key={label} className={`dm-stat dm-stat--${tone}`}>
          <span className="dm-stat__icon">
            <Icon />
          </span>
          <span>
            <span className="dm-stat__value">{value}</span>
            <span className="dm-stat__label">{label}</span>
          </span>
        </div>
      ))}
    </div>
  )
}

export default DmStats
