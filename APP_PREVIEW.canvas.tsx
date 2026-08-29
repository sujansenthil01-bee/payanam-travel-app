import React, { useState } from 'react';

export default function TravelBuddyPreview() {
  const [activeScreen, setActiveScreen] = useState('home');

  const screens = {
    login: {
      name: 'Login',
      content: (
        <div className="bg-gradient-to-b from-red-600 to-red-700 text-white p-8 min-h-screen flex flex-col justify-between rounded-lg">
          <div>
            <h1 className="text-4xl font-bold mb-2">✈️ Travel Buddy</h1>
            <p className="text-red-100 mb-8">Smart expense tracking for group trips</p>
          </div>
          
          <div className="space-y-4 mb-8">
            <div className="bg-white bg-opacity-20 rounded-lg p-4 backdrop-blur">
              <input type="email" placeholder="Email" className="w-full bg-white bg-opacity-20 text-white placeholder-red-100 py-3 px-4 rounded border border-white border-opacity-30" />
            </div>
            <div className="bg-white bg-opacity-20 rounded-lg p-4 backdrop-blur">
              <input type="password" placeholder="Password" className="w-full bg-white bg-opacity-20 text-white placeholder-red-100 py-3 px-4 rounded border border-white border-opacity-30" />
            </div>
            <button className="w-full bg-white text-red-600 font-bold py-3 rounded-lg hover:bg-red-50">Sign In</button>
            <button className="w-full bg-red-500 text-white font-bold py-3 rounded-lg">Sign in with Google</button>
          </div>

          <div className="space-y-2 text-sm">
            <div className="flex items-center">💰 Easy Expense Tracking</div>
            <div className="flex items-center">👥 Smart Cost Splitting</div>
            <div className="flex items-center">🤖 AI Travel Buddy</div>
            <div className="flex items-center">🗺️ India Map Integration</div>
          </div>
        </div>
      )
    },
    home: {
      name: 'Home Dashboard',
      content: (
        <div className="bg-gray-50 min-h-screen">
          <div className="bg-gradient-to-r from-red-600 to-red-700 text-white p-6">
            <h1 className="text-3xl font-bold">👋 Hello, User!</h1>
            <p className="text-red-100">You have 2 active trips</p>
          </div>

          <div className="p-4 space-y-3">
            <div className="grid grid-cols-3 gap-2 mb-4">
              <button className="bg-white p-3 rounded-lg shadow text-center hover:shadow-md">
                <div className="text-2xl">➕</div>
                <div className="text-xs mt-1 font-semibold">New Trip</div>
              </button>
              <button className="bg-white p-3 rounded-lg shadow text-center hover:shadow-md">
                <div className="text-2xl">🤝</div>
                <div className="text-xs mt-1 font-semibold">Join Trip</div>
              </button>
              <button className="bg-white p-3 rounded-lg shadow text-center hover:shadow-md">
                <div className="text-2xl">🤖</div>
                <div className="text-xs mt-1 font-semibold">Travel Buddy</div>
              </button>
            </div>

            <div className="bg-white rounded-lg shadow p-4 space-y-2">
              <div className="flex justify-between items-start">
                <div>
                  <h3 className="font-bold text-lg">Goa Beach Trip</h3>
                  <p className="text-sm text-gray-500">Goa, India</p>
                </div>
                <span className="bg-orange-100 text-orange-700 text-xs font-semibold px-2 py-1 rounded">Ongoing</span>
              </div>
              <div className="text-sm text-gray-600">Aug 25 - Sep 2 • 5 members</div>
              <div className="text-sm font-semibold">💰 ₹15,250 spent</div>
            </div>

            <div className="bg-white rounded-lg shadow p-4 space-y-2">
              <div className="flex justify-between items-start">
                <div>
                  <h3 className="font-bold text-lg">Mumbai Food Festival</h3>
                  <p className="text-sm text-gray-500">Mumbai, India</p>
                </div>
                <span className="bg-green-100 text-green-700 text-xs font-semibold px-2 py-1 rounded">Upcoming</span>
              </div>
              <div className="text-sm text-gray-600">Sep 15 - Sep 18 • 3 members</div>
              <div className="text-sm font-semibold">💰 ₹0 spent</div>
            </div>
          </div>
        </div>
      )
    },
    expense: {
      name: 'Add Expense',
      content: (
        <div className="bg-gray-50 min-h-screen">
          <div className="bg-red-600 text-white p-4">
            <h2 className="text-xl font-bold">Add Expense</h2>
          </div>

          <div className="p-4 space-y-4">
            <div>
              <label className="block text-sm font-semibold mb-2">Amount (₹)</label>
              <input type="number" placeholder="500" className="w-full border border-gray-300 rounded-lg p-3" />
            </div>

            <div>
              <label className="block text-sm font-semibold mb-2">Category</label>
              <select className="w-full border border-gray-300 rounded-lg p-3">
                <option>🍽️ Food</option>
                <option>🏨 Accommodation</option>
                <option>🚗 Transport</option>
                <option>🎉 Activities</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-semibold mb-2">Paid By</label>
              <select className="w-full border border-gray-300 rounded-lg p-3">
                <option>Rahul (Me)</option>
                <option>Priya</option>
                <option>Amit</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-semibold mb-2">Split Equally Among</label>
              <div className="space-y-2">
                <label className="flex items-center">
                  <input type="checkbox" defaultChecked className="w-4 h-4" /> <span className="ml-2">Rahul</span>
                </label>
                <label className="flex items-center">
                  <input type="checkbox" defaultChecked className="w-4 h-4" /> <span className="ml-2">Priya</span>
                </label>
                <label className="flex items-center">
                  <input type="checkbox" defaultChecked className="w-4 h-4" /> <span className="ml-2">Amit</span>
                </label>
              </div>
            </div>

            <div>
              <label className="block text-sm font-semibold mb-2">Receipt (Optional)</label>
              <button className="w-full border-2 border-dashed border-red-300 rounded-lg p-4 text-red-600 font-semibold">
                📸 Add Photo
              </button>
            </div>

            <button className="w-full bg-red-600 text-white font-bold py-3 rounded-lg">Add Expense</button>
          </div>
        </div>
      )
    },
    chat: {
      name: 'Travel Buddy AI',
      content: (
        <div className="bg-gray-50 min-h-screen flex flex-col">
          <div className="bg-red-600 text-white p-4">
            <h2 className="text-xl font-bold">🤖 Travel Buddy</h2>
            <p className="text-sm text-red-100">Your AI trip assistant</p>
          </div>

          <div className="flex-1 p-4 space-y-3 overflow-y-auto">
            <div className="bg-white rounded-lg p-3 max-w-xs">
              <p className="text-sm">Hi! I'm your Travel Buddy. I can help you track expenses, manage payments, and get trip recommendations. What would you like to do?</p>
            </div>

            <div className="flex justify-end">
              <div className="bg-red-600 text-white rounded-lg p-3 max-w-xs">
                <p className="text-sm">How much have we spent on food so far?</p>
              </div>
            </div>

            <div className="bg-white rounded-lg p-3 max-w-xs">
              <p className="text-sm font-semibold">📊 Food Expenses Breakdown</p>
              <p className="text-sm mt-2">Total: ₹2,450</p>
              <p className="text-xs text-gray-600 mt-1">Breakfast: ₹450 | Lunch: ₹1,200 | Dinner: ₹800</p>
            </div>
          </div>

          <div className="border-t bg-white p-3 flex gap-2">
            <input type="text" placeholder="Ask me anything..." className="flex-1 border border-gray-300 rounded-lg p-2 text-sm" />
            <button className="bg-red-600 text-white px-4 py-2 rounded-lg font-semibold">Send</button>
          </div>
        </div>
      )
    },
    settle: {
      name: 'Settle Up',
      content: (
        <div className="bg-gray-50 min-h-screen">
          <div className="bg-red-600 text-white p-4">
            <h2 className="text-xl font-bold">💳 Settle Up</h2>
            <p className="text-sm text-red-100">Who owes whom</p>
          </div>

          <div className="p-4 space-y-3">
            <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
              <h3 className="font-bold text-yellow-900">👤 You owe Priya ₹550</h3>
              <div className="text-sm text-yellow-800 mt-2">From "Restaurant" on Aug 28</div>
              <button className="mt-3 w-full bg-yellow-600 text-white py-2 rounded font-semibold text-sm">Record Payment</button>
            </div>

            <div className="bg-green-50 border border-green-200 rounded-lg p-4">
              <h3 className="font-bold text-green-900">👤 Amit owes you ₹1,250</h3>
              <div className="text-sm text-green-800 mt-2">From "Hotel" on Aug 26</div>
              <button className="mt-3 w-full bg-green-600 text-white py-2 rounded font-semibold text-sm">Mark as Paid</button>
            </div>

            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
              <h3 className="font-bold text-blue-900">📊 Trip Summary</h3>
              <div className="text-sm text-blue-800 mt-2 space-y-1">
                <div>Total Spent: ₹15,250</div>
                <div>Your Share: ₹5,083</div>
                <div>You've Paid: ₹8,500</div>
                <div className="font-bold mt-2">Net Balance: ₹+3,417 (You're owed)</div>
              </div>
            </div>
          </div>
        </div>
      )
    },
    recap: {
      name: 'Trip Recap',
      content: (
        <div className="bg-gray-50 min-h-screen">
          <div className="bg-red-600 text-white p-4">
            <h2 className="text-xl font-bold">🎉 Trip Recap</h2>
            <p className="text-sm text-red-100">Goa Beach Trip 2024</p>
          </div>

          <div className="p-4 space-y-4">
            <div className="bg-white rounded-lg shadow p-4">
              <h3 className="font-bold mb-3">📊 Expense Breakdown</h3>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span>🍽️ Food</span>
                  <span className="font-bold">₹4,500</span>
                </div>
                <div className="flex justify-between">
                  <span>🏨 Accommodation</span>
                  <span className="font-bold">₹6,000</span>
                </div>
                <div className="flex justify-between">
                  <span>🚗 Transport</span>
                  <span className="font-bold">₹2,200</span>
                </div>
                <div className="flex justify-between">
                  <span>🎉 Activities</span>
                  <span className="font-bold">₹2,550</span>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-lg shadow p-4">
              <h3 className="font-bold mb-3">👥 Member Breakdown</h3>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between items-center">
                  <span>Rahul</span>
                  <span className="font-bold">₹5,083 share</span>
                </div>
                <div className="flex justify-between items-center">
                  <span>Priya</span>
                  <span className="font-bold">₹5,083 share</span>
                </div>
                <div className="flex justify-between items-center">
                  <span>Amit</span>
                  <span className="font-bold">₹5,084 share</span>
                </div>
              </div>
            </div>

            <div className="bg-gradient-to-r from-red-500 to-red-600 text-white rounded-lg shadow p-4">
              <h3 className="font-bold mb-2">✨ Trip Highlights</h3>
              <ul className="text-sm space-y-1">
                <li>🌅 Sunrise at Aguada Fort</li>
                <li>🏖️ Beach volleyball tournament</li>
                <li>🍛 Amazing seafood dinner</li>
                <li>📸 Group photo at Dudhsagar Falls</li>
              </ul>
            </div>

            <button className="w-full bg-red-600 text-white py-3 rounded-lg font-bold">Share Trip Recap</button>
          </div>
        </div>
      )
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-red-50 to-gray-100 p-8">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-4xl font-bold text-red-700 mb-2">✈️ Travel Buddy App Preview</h1>
        <p className="text-gray-600 mb-8">Smart expense tracking for group trips with AI assistance</p>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Phone Preview */}
          <div className="lg:col-span-2">
            <div className="bg-black rounded-3xl shadow-2xl overflow-hidden" style={{ aspectRatio: '9/19.5' }}>
              <div className="bg-gray-200 h-6 flex justify-between items-center px-6 text-xs font-bold">
                <span>9:41</span>
                <div className="flex gap-1">
                  <span>📶</span>
                  <span>📡</span>
                  <span>🔋</span>
                </div>
              </div>
              <div className="bg-white h-full overflow-hidden" style={{ aspectRatio: '9/18' }}>
                {screens[activeScreen].content}
              </div>
            </div>
          </div>

          {/* Screen Navigation */}
          <div className="space-y-4">
            <div className="bg-white rounded-lg shadow p-4">
              <h2 className="font-bold text-lg mb-4">📱 Screens</h2>
              <div className="space-y-2">
                {Object.entries(screens).map(([key, screen]) => (
                  <button
                    key={key}
                    onClick={() => setActiveScreen(key)}
                    className={`w-full text-left px-4 py-3 rounded-lg font-semibold transition ${
                      activeScreen === key
                        ? 'bg-red-600 text-white'
                        : 'bg-gray-100 text-gray-800 hover:bg-gray-200'
                    }`}
                  >
                    {screen.name}
                  </button>
                ))}
              </div>
            </div>

            <div className="bg-gradient-to-br from-red-600 to-red-700 text-white rounded-lg shadow p-4">
              <h3 className="font-bold mb-3">✨ Key Features</h3>
              <ul className="text-sm space-y-2">
                <li>✅ Group trip management</li>
                <li>✅ Smart expense splitting</li>
                <li>✅ Receipt photos</li>
                <li>✅ AI Travel Buddy</li>
                <li>✅ Payment tracking</li>
                <li>✅ Trip recaps</li>
                <li>✅ India map integration</li>
                <li>✅ Rupees currency</li>
              </ul>
            </div>

            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
              <h3 className="font-bold text-blue-900 mb-2">🚀 Ready to Deploy?</h3>
              <p className="text-sm text-blue-800">Follow QUICK_DEPLOY.md for step-by-step instructions to launch on Play Store</p>
            </div>
          </div>
        </div>

        {/* Feature Details */}
        <div className="mt-12 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="bg-white rounded-lg shadow p-4">
            <div className="text-3xl mb-2">💰</div>
            <h4 className="font-bold mb-2">Expense Tracking</h4>
            <p className="text-sm text-gray-600">Track all trip expenses with categories, photos, and descriptions</p>
          </div>

          <div className="bg-white rounded-lg shadow p-4">
            <div className="text-3xl mb-2">👥</div>
            <h4 className="font-bold mb-2">Smart Splitting</h4>
            <p className="text-sm text-gray-600">Split equally or by custom amounts/percentages</p>
          </div>

          <div className="bg-white rounded-lg shadow p-4">
            <div className="text-3xl mb-2">🤖</div>
            <h4 className="font-bold mb-2">AI Assistant</h4>
            <p className="text-sm text-gray-600">Get budget tips and expense suggestions from Travel Buddy</p>
          </div>

          <div className="bg-white rounded-lg shadow p-4">
            <div className="text-3xl mb-2">🗺️</div>
            <h4 className="font-bold mb-2">India Maps</h4>
            <p className="text-sm text-gray-600">Explore destinations and track locations</p>
          </div>
        </div>

        {/* Tech Stack */}
        <div className="mt-12 bg-white rounded-lg shadow p-6">
          <h2 className="text-2xl font-bold mb-6">🛠️ Tech Stack</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div>
              <h3 className="font-bold text-red-600 mb-3">Backend</h3>
              <ul className="text-sm space-y-1 text-gray-700">
                <li>• Node.js + Express</li>
                <li>• MongoDB Atlas</li>
                <li>• JWT Authentication</li>
                <li>• OpenAI GPT-3.5</li>
                <li>• Render hosting</li>
              </ul>
            </div>
            <div>
              <h3 className="font-bold text-red-600 mb-3">Mobile</h3>
              <ul className="text-sm space-y-1 text-gray-700">
                <li>• React Native</li>
                <li>• TypeScript</li>
                <li>• React Navigation</li>
                <li>• AsyncStorage</li>
                <li>• Android ready</li>
              </ul>
            </div>
            <div>
              <h3 className="font-bold text-red-600 mb-3">Features</h3>
              <ul className="text-sm space-y-1 text-gray-700">
                <li>• 30+ API endpoints</li>
                <li>• 7 MongoDB collections</li>
                <li>• Google OAuth</li>
                <li>• File uploads</li>
                <li>• Real-time chat</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
