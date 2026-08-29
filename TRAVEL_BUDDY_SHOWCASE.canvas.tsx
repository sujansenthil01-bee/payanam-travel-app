import React, { useState } from 'react';

export default function TravelBuddyApp() {
  const [activeScreen, setActiveScreen] = useState('home');

  const screens = {
    login: {
      name: '🔐 Login',
      icon: '🔐',
      content: (
        <div className="bg-gradient-to-b from-red-600 to-red-700 text-white min-h-screen flex flex-col justify-between p-6 rounded-2xl">
          <div>
            <h1 className="text-5xl font-bold mb-2">✈️</h1>
            <h2 className="text-3xl font-bold mb-1">Travel Buddy</h2>
            <p className="text-red-100 text-lg mb-12">Smart expense tracking for group trips</p>
          </div>
          
          <div className="space-y-4 mb-8">
            <div className="bg-white bg-opacity-10 backdrop-blur rounded-xl p-4 border border-white border-opacity-20">
              <input type="email" placeholder="Email" className="w-full bg-transparent text-white placeholder-red-200 py-3 focus:outline-none text-lg" />
            </div>
            <div className="bg-white bg-opacity-10 backdrop-blur rounded-xl p-4 border border-white border-opacity-20">
              <input type="password" placeholder="Password" className="w-full bg-transparent text-white placeholder-red-200 py-3 focus:outline-none text-lg" />
            </div>
            <button className="w-full bg-white text-red-600 font-bold py-4 rounded-xl hover:bg-gray-100 text-lg">Sign In</button>
            <button className="w-full bg-red-500 text-white font-bold py-4 rounded-xl hover:bg-red-600 text-lg">Sign in with Google 🔐</button>
          </div>

          <div className="space-y-3 text-sm">
            <div className="flex items-center gap-2">💰 <span>Easy Expense Tracking</span></div>
            <div className="flex items-center gap-2">👥 <span>Smart Cost Splitting</span></div>
            <div className="flex items-center gap-2">🤖 <span>AI Travel Buddy</span></div>
            <div className="flex items-center gap-2">🗺️ <span>India Map Integration</span></div>
          </div>
        </div>
      )
    },
    home: {
      name: '🏠 Home',
      icon: '🏠',
      content: (
        <div className="bg-white min-h-screen flex flex-col rounded-2xl overflow-hidden">
          <div className="bg-gradient-to-r from-red-600 to-red-700 text-white p-6 rounded-b-3xl">
            <h1 className="text-3xl font-bold">👋 Hello, User!</h1>
            <p className="text-red-100 text-lg">You have 2 active trips</p>
          </div>

          <div className="p-6 space-y-4 overflow-y-auto flex-1">
            <div className="grid grid-cols-3 gap-3">
              <button className="bg-red-50 p-4 rounded-2xl shadow-sm hover:shadow-md transition text-center">
                <div className="text-3xl mb-2">➕</div>
                <div className="text-xs font-bold text-red-700">New Trip</div>
              </button>
              <button className="bg-red-50 p-4 rounded-2xl shadow-sm hover:shadow-md transition text-center">
                <div className="text-3xl mb-2">🤝</div>
                <div className="text-xs font-bold text-red-700">Join Trip</div>
              </button>
              <button className="bg-red-50 p-4 rounded-2xl shadow-sm hover:shadow-md transition text-center">
                <div className="text-3xl mb-2">🤖</div>
                <div className="text-xs font-bold text-red-700">Travel Buddy</div>
              </button>
            </div>

            <div className="bg-white border-2 border-red-100 rounded-2xl p-4 shadow-sm">
              <div className="flex justify-between items-start mb-3">
                <div>
                  <h3 className="font-bold text-xl text-gray-900">Goa Beach Trip</h3>
                  <p className="text-sm text-gray-500">Goa, India 🏖️</p>
                </div>
                <span className="bg-orange-100 text-orange-700 text-xs font-bold px-3 py-1 rounded-full">Ongoing</span>
              </div>
              <div className="text-sm text-gray-600 mb-2">Aug 25 - Sep 2 • 5 members 👥</div>
              <div className="text-lg font-bold text-red-600">💰 ₹15,250 spent</div>
            </div>

            <div className="bg-white border-2 border-green-100 rounded-2xl p-4 shadow-sm">
              <div className="flex justify-between items-start mb-3">
                <div>
                  <h3 className="font-bold text-xl text-gray-900">Mumbai Food Festival</h3>
                  <p className="text-sm text-gray-500">Mumbai, India 🍛</p>
                </div>
                <span className="bg-green-100 text-green-700 text-xs font-bold px-3 py-1 rounded-full">Upcoming</span>
              </div>
              <div className="text-sm text-gray-600 mb-2">Sep 15 - Sep 18 • 3 members 👥</div>
              <div className="text-lg font-bold text-red-600">💰 ₹0 spent</div>
            </div>
          </div>
        </div>
      )
    },
    expense: {
      name: '💰 Expense',
      icon: '💰',
      content: (
        <div className="bg-white min-h-screen flex flex-col rounded-2xl overflow-hidden">
          <div className="bg-red-600 text-white p-6 rounded-b-3xl">
            <h2 className="text-2xl font-bold">Add Expense</h2>
          </div>

          <div className="p-6 space-y-5 overflow-y-auto flex-1">
            <div>
              <label className="block text-sm font-bold text-gray-700 mb-3">Amount (₹)</label>
              <input type="number" placeholder="500" className="w-full border-2 border-red-200 rounded-xl p-4 text-lg focus:border-red-600 focus:outline-none" />
            </div>

            <div>
              <label className="block text-sm font-bold text-gray-700 mb-3">Category</label>
              <select className="w-full border-2 border-red-200 rounded-xl p-4 text-lg focus:border-red-600 focus:outline-none">
                <option>🍽️ Food</option>
                <option>🏨 Accommodation</option>
                <option>🚗 Transport</option>
                <option>🎉 Activities</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-bold text-gray-700 mb-3">Paid By</label>
              <select className="w-full border-2 border-red-200 rounded-xl p-4 text-lg focus:border-red-600 focus:outline-none">
                <option>👤 Rahul (Me)</option>
                <option>👤 Priya</option>
                <option>👤 Amit</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-bold text-gray-700 mb-3">Split Among</label>
              <div className="space-y-2">
                {['Rahul', 'Priya', 'Amit'].map((name) => (
                  <label key={name} className="flex items-center p-3 border-2 border-gray-200 rounded-xl hover:border-red-200">
                    <input type="checkbox" defaultChecked className="w-5 h-5 accent-red-600 cursor-pointer" />
                    <span className="ml-3 font-semibold text-gray-700">👤 {name}</span>
                  </label>
                ))}
              </div>
            </div>

            <div>
              <label className="block text-sm font-bold text-gray-700 mb-3">Receipt (Optional)</label>
              <button className="w-full border-2 border-dashed border-red-300 rounded-xl p-6 text-red-600 font-bold hover:bg-red-50 transition">
                📸 Add Photo
              </button>
            </div>

            <button className="w-full bg-red-600 text-white font-bold py-4 rounded-xl hover:bg-red-700 text-lg">✅ Add Expense</button>
          </div>
        </div>
      )
    },
    chat: {
      name: '🤖 Chat',
      icon: '🤖',
      content: (
        <div className="bg-white min-h-screen flex flex-col rounded-2xl overflow-hidden">
          <div className="bg-red-600 text-white p-6 rounded-b-3xl">
            <h2 className="text-2xl font-bold">🤖 Travel Buddy</h2>
            <p className="text-sm text-red-100">Your AI trip assistant</p>
          </div>

          <div className="flex-1 p-6 space-y-4 overflow-y-auto bg-gray-50">
            <div className="bg-white rounded-2xl p-4 max-w-xs shadow-sm">
              <p className="text-sm text-gray-800">Hi! I'm your Travel Buddy AI. I can help you track expenses, manage payments, and get trip recommendations. What would you like to do?</p>
            </div>

            <div className="flex justify-end">
              <div className="bg-red-600 text-white rounded-2xl p-4 max-w-xs shadow-sm">
                <p className="text-sm">How much have we spent on food so far?</p>
              </div>
            </div>

            <div className="bg-white rounded-2xl p-4 max-w-xs shadow-sm">
              <p className="text-sm font-bold text-gray-900">📊 Food Expenses Breakdown</p>
              <p className="text-sm text-gray-700 mt-2">Total: <span className="font-bold">₹2,450</span></p>
              <p className="text-xs text-gray-500 mt-1">🌅 Breakfast: ₹450 | 🥗 Lunch: ₹1,200 | 🍽️ Dinner: ₹800</p>
            </div>
          </div>

          <div className="border-t-2 border-gray-200 bg-white p-4 flex gap-3">
            <input type="text" placeholder="Ask me anything..." className="flex-1 border-2 border-gray-300 rounded-xl p-3 text-sm focus:border-red-600 focus:outline-none" />
            <button className="bg-red-600 text-white px-5 py-3 rounded-xl font-bold hover:bg-red-700">Send</button>
          </div>
        </div>
      )
    },
    settle: {
      name: '💳 Settle',
      icon: '💳',
      content: (
        <div className="bg-white min-h-screen flex flex-col rounded-2xl overflow-hidden">
          <div className="bg-red-600 text-white p-6 rounded-b-3xl">
            <h2 className="text-2xl font-bold">💳 Settle Up</h2>
            <p className="text-sm text-red-100">Who owes whom</p>
          </div>

          <div className="p-6 space-y-4 overflow-y-auto flex-1">
            <div className="bg-yellow-50 border-2 border-yellow-300 rounded-2xl p-5">
              <h3 className="font-bold text-yellow-900 text-lg">👤 You owe Priya</h3>
              <div className="text-2xl font-bold text-yellow-700 mt-2">₹550</div>
              <div className="text-sm text-yellow-800 mt-2">From Restaurant on Aug 28</div>
              <button className="mt-4 w-full bg-yellow-600 text-white py-3 rounded-xl font-bold hover:bg-yellow-700">Record Payment</button>
            </div>

            <div className="bg-green-50 border-2 border-green-300 rounded-2xl p-5">
              <h3 className="font-bold text-green-900 text-lg">👤 Amit owes you</h3>
              <div className="text-2xl font-bold text-green-700 mt-2">₹1,250</div>
              <div className="text-sm text-green-800 mt-2">From Hotel on Aug 26</div>
              <button className="mt-4 w-full bg-green-600 text-white py-3 rounded-xl font-bold hover:bg-green-700">Mark as Paid</button>
            </div>

            <div className="bg-blue-50 border-2 border-blue-300 rounded-2xl p-5">
              <h3 className="font-bold text-blue-900 text-lg">📊 Trip Summary</h3>
              <div className="text-sm text-blue-800 mt-3 space-y-2">
                <div className="flex justify-between"><span>Total Spent:</span><span className="font-bold">₹15,250</span></div>
                <div className="flex justify-between"><span>Your Share:</span><span className="font-bold">₹5,083</span></div>
                <div className="flex justify-between"><span>You've Paid:</span><span className="font-bold">₹8,500</span></div>
                <div className="flex justify-between border-t border-blue-200 pt-2 mt-2"><span className="font-bold">Balance (Owed):</span><span className="font-bold text-green-600">₹+3,417</span></div>
              </div>
            </div>
          </div>
        </div>
      )
    },
    recap: {
      name: '🎉 Recap',
      icon: '🎉',
      content: (
        <div className="bg-white min-h-screen flex flex-col rounded-2xl overflow-hidden">
          <div className="bg-red-600 text-white p-6 rounded-b-3xl">
            <h2 className="text-2xl font-bold">🎉 Trip Recap</h2>
            <p className="text-sm text-red-100">Goa Beach Trip 2024</p>
          </div>

          <div className="p-6 space-y-4 overflow-y-auto flex-1">
            <div className="bg-gray-50 border-2 border-gray-200 rounded-2xl p-5">
              <h3 className="font-bold text-gray-900 mb-4 text-lg">📊 Expense Breakdown</h3>
              <div className="space-y-3">
                {[
                  { icon: '🍽️', name: 'Food', amount: '₹4,500' },
                  { icon: '🏨', name: 'Accommodation', amount: '₹6,000' },
                  { icon: '🚗', name: 'Transport', amount: '₹2,200' },
                  { icon: '🎉', name: 'Activities', amount: '₹2,550' }
                ].map((item) => (
                  <div key={item.name} className="flex justify-between items-center p-3 bg-white rounded-xl border border-gray-200">
                    <span className="font-semibold text-gray-700">{item.icon} {item.name}</span>
                    <span className="font-bold text-red-600">{item.amount}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="bg-gradient-to-r from-red-500 to-red-600 text-white rounded-2xl p-5">
              <h3 className="font-bold mb-3 text-lg">✨ Trip Highlights</h3>
              <ul className="text-sm space-y-2">
                <li>🌅 Sunrise at Aguada Fort</li>
                <li>🏖️ Beach volleyball tournament</li>
                <li>🍛 Amazing seafood dinner</li>
                <li>📸 Group photo at Dudhsagar Falls</li>
              </ul>
            </div>

            <button className="w-full bg-red-600 text-white py-4 rounded-xl font-bold hover:bg-red-700 text-lg">Share Trip Recap 📤</button>
          </div>
        </div>
      )
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-red-50 via-white to-red-50 p-8">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-12">
          <h1 className="text-5xl font-black bg-gradient-to-r from-red-600 to-red-700 bg-clip-text text-transparent mb-3">✈️ Travel Buddy App</h1>
          <p className="text-xl text-gray-600">Smart expense tracking for group trips with AI assistance</p>
          <p className="text-sm text-gray-500 mt-2">Built with React Native • Android Ready • Free Deployment 🚀</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Phone Preview */}
          <div className="lg:col-span-2">
            <div className="mx-auto max-w-sm">
              {/* iPhone Frame */}
              <div className="bg-black rounded-3xl shadow-2xl overflow-hidden border-8 border-gray-900" style={{ aspectRatio: '9/19.5' }}>
                {/* Status Bar */}
                <div className="bg-gray-900 text-white text-xs font-bold flex justify-between items-center px-6 py-2 h-6">
                  <span>9:41</span>
                  <div className="flex gap-0.5">
                    <span>📶</span>
                    <span>📡</span>
                    <span>🔋</span>
                  </div>
                </div>
                {/* Screen */}
                <div className="bg-white overflow-hidden" style={{ aspectRatio: '9/18.5' }}>
                  {screens[activeScreen].content}
                </div>
              </div>
            </div>
          </div>

          {/* Screen Navigation + Features */}
          <div className="lg:col-span-2 space-y-6">
            {/* Screen Buttons */}
            <div className="bg-white rounded-2xl shadow-lg p-6">
              <h2 className="font-bold text-2xl mb-4">📱 Screens</h2>
              <div className="grid grid-cols-2 gap-3">
                {Object.entries(screens).map(([key, screen]) => (
                  <button
                    key={key}
                    onClick={() => setActiveScreen(key)}
                    className={`px-4 py-3 rounded-xl font-bold transition transform hover:scale-105 ${
                      activeScreen === key
                        ? 'bg-red-600 text-white shadow-lg'
                        : 'bg-gray-100 text-gray-800 hover:bg-gray-200'
                    }`}
                  >
                    <span className="text-lg">{screen.icon}</span>
                    <div className="text-xs mt-1">{screen.name.split(' ')[1]}</div>
                  </button>
                ))}
              </div>
            </div>

            {/* Key Features */}
            <div className="bg-gradient-to-br from-red-600 to-red-700 text-white rounded-2xl shadow-lg p-6">
              <h3 className="font-bold text-xl mb-4">✨ Key Features</h3>
              <div className="grid grid-cols-2 gap-3 text-sm">
                {[
                  { icon: '💰', label: 'Expense Tracking' },
                  { icon: '👥', label: 'Smart Splits' },
                  { icon: '📸', label: 'Receipt Photos' },
                  { icon: '🤖', label: 'AI Assistant' },
                  { icon: '💳', label: 'Payments' },
                  { icon: '🎉', label: 'Trip Recaps' },
                  { icon: '🗺️', label: 'India Maps' },
                  { icon: '₹', label: 'Rupees' }
                ].map((feat) => (
                  <div key={feat.label} className="flex items-center gap-2">
                    <span className="text-lg">{feat.icon}</span>
                    <span className="font-semibold">{feat.label}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Deployment Ready */}
            <div className="bg-gradient-to-br from-green-50 to-emerald-50 border-2 border-green-300 rounded-2xl shadow-lg p-6">
              <div className="flex items-center gap-3 mb-3">
                <span className="text-3xl">🚀</span>
                <h3 className="font-bold text-lg text-green-900">Ready to Deploy!</h3>
              </div>
              <p className="text-sm text-green-800 mb-4">Your complete app is ready for Android deployment in 3-4 hours.</p>
              <div className="space-y-2 text-xs text-green-800">
                <div>✅ Backend API (30+ endpoints)</div>
                <div>✅ MongoDB Database (7 collections)</div>
                <div>✅ Mobile App (React Native)</div>
                <div>✅ Deployment Guides (all steps)</div>
              </div>
            </div>
          </div>
        </div>

        {/* Tech Stack */}
        <div className="mt-12 bg-white rounded-2xl shadow-lg p-8">
          <h2 className="text-3xl font-bold text-gray-900 mb-8">🛠️ Complete Tech Stack</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="p-6 bg-gradient-to-br from-blue-50 to-blue-100 rounded-xl border-l-4 border-blue-600">
              <h3 className="font-bold text-lg text-blue-900 mb-4">🖥️ Backend</h3>
              <ul className="text-sm text-blue-800 space-y-2">
                <li>✓ Node.js + Express.js</li>
                <li>✓ MongoDB Atlas (Free)</li>
                <li>✓ JWT Authentication</li>
                <li>✓ Google OAuth 2.0</li>
                <li>✓ OpenAI GPT-3.5 Integration</li>
                <li>✓ Render Hosting (Free)</li>
              </ul>
            </div>
            <div className="p-6 bg-gradient-to-br from-purple-50 to-purple-100 rounded-xl border-l-4 border-purple-600">
              <h3 className="font-bold text-lg text-purple-900 mb-4">📱 Mobile</h3>
              <ul className="text-sm text-purple-800 space-y-2">
                <li>✓ React Native 0.72.4</li>
                <li>✓ TypeScript</li>
                <li>✓ React Navigation</li>
                <li>✓ AsyncStorage</li>
                <li>✓ Android Ready</li>
                <li>✓ Play Store Submission</li>
              </ul>
            </div>
            <div className="p-6 bg-gradient-to-br from-emerald-50 to-emerald-100 rounded-xl border-l-4 border-emerald-600">
              <h3 className="font-bold text-lg text-emerald-900 mb-4">📊 Database & APIs</h3>
              <ul className="text-sm text-emerald-800 space-y-2">
                <li>✓ 7 MongoDB Collections</li>
                <li>✓ 30+ RESTful APIs</li>
                <li>✓ Expense Splitting Logic</li>
                <li>✓ Payment Settlement Calc</li>
                <li>✓ File Upload (Multer)</li>
                <li>✓ OpenStreetMap Integration</li>
              </ul>
            </div>
          </div>
        </div>

        {/* Call to Action */}
        <div className="mt-12 text-center">
          <div className="inline-block bg-gradient-to-r from-red-600 to-red-700 text-white rounded-2xl shadow-lg p-8">
            <h2 className="text-3xl font-bold mb-3">Ready to Launch? 🎯</h2>
            <p className="text-lg mb-4">Follow QUICK_DEPLOY.md in your GitHub repo to deploy in ~3-4 hours!</p>
            <p className="text-sm opacity-90">GitHub: github.com/sujansenthil01-bee/payanam-travel-app</p>
          </div>
        </div>
      </div>
    </div>
  );
}
