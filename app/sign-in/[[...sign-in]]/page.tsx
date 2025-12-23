import { SignIn } from '@clerk/nextjs'
import Image from 'next/image'

export default function Page() {
  return (
    <main className='min-h-screen bg-gradient-to-br from-indigo-50 via-white to-purple-50 flex items-center justify-center p-4'>
      <div className='w-full max-w-6xl grid lg:grid-cols-2 gap-8 items-center'>
        {/* Left Side - Branding & Info */}
        <div className='hidden lg:flex flex-col justify-center space-y-8 px-8'>
          <div className='space-y-6'>
            <div className='flex items-center gap-3'>
              <div className='w-12 h-12 bg-gradient-to-r from-indigo-600 to-purple-600 rounded-xl flex items-center justify-center'>
                <Image
                  src="/images/logo.svg"
                  alt="logo"
                  width={28}
                  height={28}
                  className='filter brightness-0 invert'
                />
              </div>
              <h1 className='text-3xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent'>
                AI Learning Companions
              </h1>
            </div>
            
            <div className='space-y-4'>
              <h2 className='text-4xl font-bold text-gray-900 leading-tight'>
                Welcome back to your
                <span className='block text-indigo-600'>learning journey</span>
              </h2>
              <p className='text-xl text-gray-600 leading-relaxed'>
                Continue building knowledge with your personalized AI companions. 
                Track progress, earn achievements, and unlock your potential.
              </p>
            </div>
          </div>

          {/* Features */}
          <div className='space-y-4'>
            <div className='flex items-center gap-3'>
              <div className='w-8 h-8 bg-green-100 rounded-lg flex items-center justify-center'>
                <span className='text-green-600 text-sm'>🤖</span>
              </div>
              <span className='text-gray-700'>Personalized AI Learning Companions</span>
            </div>
            <div className='flex items-center gap-3'>
              <div className='w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center'>
                <span className='text-blue-600 text-sm'>📊</span>
              </div>
              <span className='text-gray-700'>Advanced Progress Analytics</span>
            </div>
            <div className='flex items-center gap-3'>
              <div className='w-8 h-8 bg-purple-100 rounded-lg flex items-center justify-center'>
                <span className='text-purple-600 text-sm'>🎯</span>
              </div>
              <span className='text-gray-700'>Interactive Quizzes & Assessments</span>
            </div>
            <div className='flex items-center gap-3'>
              <div className='w-8 h-8 bg-orange-100 rounded-lg flex items-center justify-center'>
                <span className='text-orange-600 text-sm'>🔥</span>
              </div>
              <span className='text-gray-700'>Learning Streaks & Achievements</span>
            </div>
          </div>

          {/* Testimonial */}
          <div className='bg-white/60 backdrop-blur-sm rounded-2xl p-6 border border-white/20'>
            <div className='flex items-center gap-3 mb-3'>
              <div className='w-10 h-10 bg-gradient-to-r from-yellow-400 to-orange-500 rounded-full flex items-center justify-center'>
                <span className='text-white font-semibold text-sm'>JD</span>
              </div>
              <div>
                <p className='font-semibold text-gray-900'>Jane Doe</p>
                <p className='text-sm text-gray-600'>Pro Companion User</p>
              </div>
            </div>
            <p className='text-gray-700 italic'>
              "The AI companions have transformed how I learn. The personalized approach and detailed analytics keep me motivated every day!"
            </p>
          </div>
        </div>

        {/* Right Side - Sign In Form */}
        <div className='flex flex-col items-center justify-center'>
          <div className='w-full max-w-md'>
            {/* Mobile Header */}
            <div className='lg:hidden text-center mb-8'>
              <div className='flex items-center justify-center gap-3 mb-4'>
                <div className='w-10 h-10 bg-gradient-to-r from-indigo-600 to-purple-600 rounded-xl flex items-center justify-center'>
                  <Image
                    src="/images/logo.svg"
                    alt="logo"
                    width={24}
                    height={24}
                    className='filter brightness-0 invert'
                  />
                </div>
                <h1 className='text-2xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent'>
                  AI Learning
                </h1>
              </div>
              <h2 className='text-2xl font-bold text-gray-900 mb-2'>Welcome back!</h2>
              <p className='text-gray-600'>Continue your learning journey</p>
            </div>

            {/* Sign In Component Container */}
            <div className='bg-white/80 backdrop-blur-sm rounded-3xl shadow-2xl border border-white/20 p-8 lg:p-10'>
              <div className='hidden lg:block text-center mb-8'>
                <h3 className='text-2xl font-bold text-gray-900 mb-2'>Sign in to your account</h3>
                <p className='text-gray-600'>Welcome back! Please enter your details.</p>
              </div>
              
              {/* Clerk Sign In Component */}
              <div className='[&_.cl-rootBox]:w-full [&_.cl-card]:shadow-none [&_.cl-card]:border-0 [&_.cl-card]:bg-transparent [&_.cl-headerTitle]:text-2xl [&_.cl-headerTitle]:font-bold [&_.cl-headerSubtitle]:text-gray-600 [&_.cl-socialButtonsBlockButton]:border-gray-200 [&_.cl-socialButtonsBlockButton]:hover:bg-gray-50 [&_.cl-formButtonPrimary]:bg-gradient-to-r [&_.cl-formButtonPrimary]:from-indigo-600 [&_.cl-formButtonPrimary]:to-purple-600 [&_.cl-formButtonPrimary]:border-0 [&_.cl-formButtonPrimary]:shadow-lg [&_.cl-formButtonPrimary]:hover:shadow-xl [&_.cl-formButtonPrimary]:transition-all [&_.cl-formFieldInput]:border-gray-200 [&_.cl-formFieldInput]:focus:border-indigo-500 [&_.cl-formFieldInput]:focus:ring-indigo-500'>
                <SignIn />
              </div>
            </div>

            {/* Footer */}
            <div className='text-center mt-6'>
              <p className='text-sm text-gray-500'>
                By signing in, you agree to our{' '}
                <a href="#" className='text-indigo-600 hover:text-indigo-700 font-medium'>Terms of Service</a>
                {' '}and{' '}
                <a href="#" className='text-indigo-600 hover:text-indigo-700 font-medium'>Privacy Policy</a>
              </p>
            </div>
          </div>
        </div>
      </div>
    </main>
  )
}