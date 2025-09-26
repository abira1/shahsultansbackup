import React from 'react';
import { Calendar, Clock, TrendingUp, BarChart2, AlertCircle, ChevronRight, FileText, Bell } from 'lucide-react';
import Button from '../../components/ui/Button';
const Overview: React.FC = () => {
  return <div className="space-y-6">
      {/* Welcome section */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl font-medium text-gray-900">
            Welcome back, John
          </h1>
          <p className="text-sm text-gray-500 mt-1">
            Here's what's happening with your progress
          </p>
        </div>
        <div className="flex gap-2">
          <Button variant="primary" size="sm" to="/dashboard/exams">
            View Exams
          </Button>
          <Button variant="outline" size="sm" to="/dashboard/results">
            My Results
          </Button>
        </div>
      </div>
      {/* Quick Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-100">
          <p className="text-xs text-gray-500 mb-1">Current Band</p>
          <div className="flex items-baseline">
            <span className="text-2xl font-medium text-gray-900">7.0</span>
            <span className="ml-2 text-xs px-1.5 py-0.5 bg-green-50 text-green-700 rounded-full flex items-center">
              <TrendingUp className="h-3 w-3 mr-0.5" />
              +0.5
            </span>
          </div>
        </div>
        <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-100">
          <p className="text-xs text-gray-500 mb-1">Tests Completed</p>
          <p className="text-2xl font-medium text-gray-900">5</p>
        </div>
        <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-100">
          <p className="text-xs text-gray-500 mb-1">Upcoming Classes</p>
          <p className="text-2xl font-medium text-gray-900">3</p>
        </div>
        <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-100">
          <p className="text-xs text-gray-500 mb-1">Study Hours</p>
          <p className="text-2xl font-medium text-gray-900">42</p>
        </div>
      </div>
      
      {/* Important Notices Section */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-100">
        <div className="px-4 py-3 border-b border-gray-100 flex items-center justify-between">
          <h2 className="text-sm font-medium text-gray-900 flex items-center">
            <Bell className="h-4 w-4 text-gray-500 mr-2" />
            Important Notices
          </h2>
          <Button variant="outline" size="sm" to="/dashboard/notices" className="text-xs py-1 px-2">
            View All
          </Button>
        </div>
        <div className="p-4 space-y-3">
          <div className="border-l-2 border-red-500 bg-red-50 pl-3 py-2 rounded-sm">
            <div className="flex items-start">
              <AlertCircle className="h-4 w-4 text-red-500 mr-2 flex-shrink-0 mt-0.5" />
              <div>
                <p className="text-sm font-medium text-red-700">
                  System Maintenance
                </p>
                <p className="text-xs text-red-600">
                  The platform will be under maintenance on June 25 from 2:00 AM to 4:00 AM. All tests will be temporarily unavailable.
                </p>
              </div>
            </div>
          </div>
          <div className="border-l-2 border-primary pl-3 py-2 rounded-sm">
            <p className="text-sm font-medium text-gray-900">
              New Study Materials Available
            </p>
            <p className="text-xs text-gray-500">
              Check the resources section for updated writing task examples and speaking practice questions.
            </p>
          </div>
          <div className="border-l-2 border-green-500 bg-green-50 pl-3 py-2 rounded-sm">
            <p className="text-sm font-medium text-green-700">
              Upcoming Workshop
            </p>
            <p className="text-xs text-green-600">
              Join our IELTS Speaking strategies workshop on June 28 at 3:00 PM. Registration required.
            </p>
          </div>
        </div>
      </div>
      
      {/* Current Band Estimate & Upcoming Courses */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Current Band Estimate */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-100">
          <div className="px-4 py-3 border-b border-gray-100">
            <h2 className="text-sm font-medium text-gray-900">Current Band Estimate</h2>
            <p className="text-xs text-gray-500 mt-1">Based on your recent practice tests</p>
          </div>
          <div className="p-4">
            <div className="text-center mb-4">
              <div className="text-3xl font-bold text-primary mb-2">7.0</div>
              <p className="text-sm text-gray-600">Overall Band Score</p>
            </div>
            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600">Listening</span>
                <span className="font-medium">7.5</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600">Reading</span>
                <span className="font-medium">6.5</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600">Writing</span>
                <span className="font-medium">6.5</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600">Speaking</span>
                <span className="font-medium">7.5</span>
              </div>
            </div>
          </div>
        </div>

        {/* Upcoming Courses */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-100">
          <div className="px-4 py-3 border-b border-gray-100">
            <h2 className="text-sm font-medium text-gray-900">Upcoming Classes</h2>
            <p className="text-xs text-gray-500 mt-1">Your scheduled sessions</p>
          </div>
          <div className="p-4">
            <div className="space-y-3">
              <div className="flex items-center justify-between p-3 bg-blue-50 rounded-lg">
                <div>
                  <p className="text-sm font-medium text-blue-900">Writing Workshop</p>
                  <p className="text-xs text-blue-600">Task 2 Essay Structure</p>
                </div>
                <div className="text-right">
                  <p className="text-xs text-blue-600">June 26</p>
                  <p className="text-xs text-blue-600">2:00 PM</p>
                </div>
              </div>
              <div className="flex items-center justify-between p-3 bg-green-50 rounded-lg">
                <div>
                  <p className="text-sm font-medium text-green-900">Speaking Practice</p>
                  <p className="text-xs text-green-600">Part 2 Preparation</p>
                </div>
                <div className="text-right">
                  <p className="text-xs text-green-600">June 28</p>
                  <p className="text-xs text-green-600">4:00 PM</p>
                </div>
              </div>
              <div className="flex items-center justify-between p-3 bg-purple-50 rounded-lg">
                <div>
                  <p className="text-sm font-medium text-purple-900">Reading Strategies</p>
                  <p className="text-xs text-purple-600">Academic Passages</p>
                </div>
                <div className="text-right">
                  <p className="text-xs text-purple-600">June 30</p>
                  <p className="text-xs text-purple-600">10:00 AM</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      {/* Next Exam Section */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-100 overflow-hidden">
        <div className="px-4 py-3 border-b border-gray-100 flex items-center justify-between">
          <h2 className="text-sm font-medium text-gray-900">Next Exam</h2>
          <div className="px-2 py-1 bg-primary/10 text-primary rounded text-xs font-medium">
            In 2 days
          </div>
        </div>
        <div className="p-4">
          <h3 className="text-base font-medium text-gray-900 mb-2">
            Full IELTS Mock Test
          </h3>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mb-3 text-sm">
            <div>
              <p className="text-xs text-gray-500 mb-1">Date</p>
              <p className="flex items-center text-gray-900">
                <Calendar className="h-3.5 w-3.5 mr-1.5 text-gray-500" />
                June 15, 2023
              </p>
            </div>
            <div>
              <p className="text-xs text-gray-500 mb-1">Time</p>
              <p className="flex items-center text-gray-900">
                <Clock className="h-3.5 w-3.5 mr-1.5 text-gray-500" />
                10:00 AM
              </p>
            </div>
            <div>
              <p className="text-xs text-gray-500 mb-1">Duration</p>
              <p className="text-gray-900">2h 45m</p>
            </div>
          </div>
          <p className="text-xs text-gray-500 mb-4">
            This comprehensive mock test covers all four IELTS modules. Results
            will be available within 48 hours.
          </p>
          <Button variant="primary" size="sm" to="/dashboard/exams">
            Verify & Start Test
          </Button>
        </div>
      </div>
      {/* Completed Tests Summary */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-100">
        <div className="px-4 py-3 border-b border-gray-100 flex items-center justify-between">
          <h2 className="text-sm font-medium text-gray-900">Completed Tests Summary</h2>
          <Button variant="outline" size="sm" to="/dashboard/results" className="text-xs py-1 px-2">
            View All Results
          </Button>
        </div>
        <div className="p-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="text-center">
              <div className="text-2xl font-bold text-blue-600 mb-1">3</div>
              <p className="text-xs text-gray-600">Full Mock Tests</p>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-green-600 mb-1">8</div>
              <p className="text-xs text-gray-600">Listening Tests</p>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-purple-600 mb-1">6</div>
              <p className="text-xs text-gray-600">Reading Tests</p>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-orange-600 mb-1">4</div>
              <p className="text-xs text-gray-600">Writing Tests</p>
            </div>
          </div>
        </div>
      </div>
      {/* Study Progress */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-100">
        <div className="px-4 py-3 border-b border-gray-100 flex items-center justify-between">
          <h2 className="text-sm font-medium text-gray-900 flex items-center">
            <BarChart2 className="h-4 w-4 text-gray-500 mr-2" />
            Your Progress
          </h2>
        </div>
        <div className="p-4">
          <div className="space-y-4 mb-4">
            {[{
            name: 'Listening',
            value: 75
          }, {
            name: 'Reading',
            value: 60
          }, {
            name: 'Writing',
            value: 45
          }, {
            name: 'Speaking',
            value: 80
          }].map(skill => <div key={skill.name}>
                <div className="flex justify-between mb-1">
                  <p className="text-xs font-medium text-gray-900">
                    {skill.name}
                  </p>
                  <p className="text-xs text-gray-500">{skill.value}%</p>
                </div>
                <div className="w-full bg-gray-100 rounded-full h-1.5 overflow-hidden" role="progressbar" aria-valuenow={skill.value} aria-valuemin={0} aria-valuemax={100}>
                  <div className="bg-primary h-1.5 rounded-full transition-all duration-500 ease-out" style={{
                width: `${skill.value}%`
              }}></div>
                </div>
              </div>)}
          </div>
          <div className="flex flex-col sm:flex-row gap-2 sm:justify-between">
            <Button variant="outline" size="sm" to="/dashboard/resources" className="text-xs">
              Study Materials
            </Button>
            <Button variant="primary" size="sm" to="/dashboard/results" className="text-xs">
              View Results
            </Button>
          </div>
        </div>
      </div>
    </div>;
};
export default Overview;