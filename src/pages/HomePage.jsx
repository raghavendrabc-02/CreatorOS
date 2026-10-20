import PlatformCard from '../components/PlatformCard.jsx'
import { PLATFORMS } from '../data/platforms.js'
import { USER } from '../data/user.js'
import './HomePage.css'

function getGreeting(date) {
  const hour = date.getHours()
  if (hour < 12) return 'Good morning'
  if (hour < 17) return 'Good afternoon'
  return 'Good evening'
}

// e.g. "Tue, 20 Oct 2026"
function formatDate(date) {
  const parts = Object.fromEntries(
    new Intl.DateTimeFormat('en-GB', {
      weekday: 'short',
      day: 'numeric',
      month: 'short',
      year: 'numeric',
    })
      .formatToParts(date)
      .map(({ type, value }) => [type, value]),
  )
  return `${parts.weekday}, ${parts.day} ${parts.month} ${parts.year}`
}

function HomePage() {
  const now = new Date()

  return (
    <div className="home">
      <header className="home__hero">
        <div>
          <p className="home__greeting">{getGreeting(now)}</p>
          <h1 className="home__name">
            {USER.name} <span aria-hidden="true">👋</span>
          </h1>
          <p className="home__welcome">Welcome to CreatorOS</p>
          <p className="home__tagline">Your content creation workflow. Simplified.</p>
        </div>

        <div className="home__aside">
          <div>
            <p className="home__date-label">Today</p>
            <p className="home__date">{formatDate(now)}</p>
          </div>
          <blockquote className="home__quote">
            <span className="home__quote-mark" aria-hidden="true">“</span>
            <p>Better content creates better opportunities.</p>
          </blockquote>
        </div>
      </header>

      <section className="home__platforms" aria-label="Platforms">
        {PLATFORMS.map((platform) => (
          <PlatformCard key={platform.id} {...platform} />
        ))}
      </section>
    </div>
  )
}

export default HomePage
