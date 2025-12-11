import CompanionsCard from '@/components/CompanionsCard'
import CompanionsList from '@/components/CompanionsList'
import Cta from '@/components/Cta'
import { Button } from '@/components/ui/button'
import { recentSessions } from '@/constants'
import React from 'react'

const Page = () => {
  return (
    <main>
      <h1 className='text-2xl underline'>Popular Companions</h1>
      <section className='home-section'>
        <CompanionsCard
          id = "123"
          name = "Neura the Brainy Explorer"
          topic = "Neural Network of the brain"
          subject = "science"
          duration = {45}
          color = "#ffda6e"
        />

        <CompanionsCard
          id = "456"
          name = "Countsy the Number Wizard"
          topic = "Derrivatives & Integrals"
          subject = "maths"
          duration = {30}
          color = "#e5d0ff"
        />

        <CompanionsCard
          id = "789"
          name = "Verba the Vocubulary Builder"
          topic = "language"
          subject = "English Literature"
          duration = {30}
          color = "#BDE7FF"
        />
        
      </section>

      <section className='home-section'>
        <CompanionsList
          title = "Recently completed sessions"
          companions = {recentSessions}
          classNames = "w-2/3 max-lg:w-full"
        />
        <Cta />
      </section>
    </main>
  )
}

export default Page