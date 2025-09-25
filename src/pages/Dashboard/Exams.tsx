import React, { useState } from 'react';
import { Calendar, Clock, Filter, ChevronDown, ChevronUp, Search } from 'lucide-react';
import Button from '../../components/ui/Button';
const Exams: React.FC = () => {
  const [filterOpen, setFilterOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedType, setSelectedType] = useState<string>('all');
  const examTypes = [{
    id: 'all',
    name: 'All Exams'
  }, {
    id: 'mock',
    name: 'Full Mock Tests'
  }, {
    id: 'listening',
    name: 'Listening'
  }, {
    id: 'reading',
    name: 'Reading'
  }, {
    id: 'writing',
    name: 'Writing'
  }, {
    id: 'speaking',
    name: 'Speaking'
  }];
  return <div>
      <h1 className="text-2xl md:text-3xl font-bold mb-6">Available Exams</h1>
      {/* Search and Filter */}
      <div className="bg-white p-5 rounded-lg shadow-md mb-6">
        <div className="flex flex-col md:flex-row gap-4">
          <div className="relative flex-grow">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Search className="h-5 w-5 text-gray-400" />
            </div>
            <input type="text" className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-primary focus:border-primary" placeholder="Search exams..." value={searchQuery} onChange={e => setSearchQuery(e.target.value)} />
          </div>
          <div className="flex-shrink-0">
            <Button variant="outline" className="flex items-center" onClick={() => setFilterOpen(!filterOpen)}>
              <Filter className="h-5 w-5 mr-2" />
              Filter
              {filterOpen ? <ChevronUp className="h-4 w-4 ml-2" /> : <ChevronDown className="h-4 w-4 ml-2" />}
            </Button>
          </div>
        </div>
        {filterOpen && <div className="mt-4 pt-4 border-t border-gray-200">
            <p className="text-sm font-medium mb-2">Exam Type:</p>
            <div className="flex flex-wrap gap-2">
              {examTypes.map(type => <button key={type.id} className={`px-3 py-1 rounded-full text-sm ${selectedType === type.id ? 'bg-primary text-white' : 'bg-gray-100 text-text-secondary hover:bg-gray-200'}`} onClick={() => setSelectedType(type.id)}>
                  {type.name}
                </button>)}
            </div>
          </div>}
      </div>
      {/* Featured Exam */}
      <div className="bg-primary/5 border border-primary/20 p-6 rounded-lg shadow-md mb-8">
        <div className="flex flex-col md:flex-row">
          <div className="flex-grow">
            <div className="inline-block px-3 py-1 bg-primary text-white text-sm font-medium rounded-full mb-3">
              Recommended
            </div>
            <h2 className="text-xl font-bold mb-2">Complete IELTS Mock Test</h2>
            <p className="text-text-secondary mb-4">
              Experience a full IELTS exam under timed conditions. This
              comprehensive test covers all four modules and provides detailed
              scoring and feedback.
            </p>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mb-4">
              <div className="flex items-center">
                <Clock className="h-4 w-4 text-primary mr-2" />
                <span className="text-sm">2 hours 45 minutes</span>
              </div>
              <div className="flex items-center">
                <Calendar className="h-4 w-4 text-primary mr-2" />
                <span className="text-sm">Available 24/7</span>
              </div>
              <div className="flex items-center">
                <div className="h-4 w-4 rounded-full bg-green-500 mr-2"></div>
                <span className="text-sm">Ready to take</span>
              </div>
            </div>
          </div>
          <div className="md:ml-6 mt-4 md:mt-0 flex items-center justify-center md:justify-end">
            <Button variant="primary" to="/mock-test" className="px-6">
              Start Full Mock Test
            </Button>
          </div>
        </div>
      </div>
      {/* Available Exams */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
        {/* Listening Practice Test */}
        <div className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow">
          <div className="h-3 bg-blue-500 w-full"></div>
          <div className="p-6">
            <div className="flex justify-between items-start mb-3">
              <h3 className="font-semibold text-lg">Listening Practice Test</h3>
              <span className="bg-green-100 text-green-800 text-xs px-2 py-1 rounded-full">
                Available
              </span>
            </div>
            <p className="text-sm text-text-secondary mb-4">
              Practice your listening skills with audio recordings and various question types. Includes all four sections with increasing difficulty.
            </p>
            <div className="flex items-center text-sm text-text-tertiary mb-4">
              <Clock className="h-4 w-4 mr-2" />
              <span>30 minutes</span>
            </div>
            <Button variant="primary" to="/exam/listening/start" fullWidth>
              Start Test
            </Button>
          </div>
        </div>

        {/* Academic Reading Test */}
        <div className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow">
          <div className="h-3 bg-green-500 w-full"></div>
          <div className="p-6">
            <div className="flex justify-between items-start mb-3">
              <h3 className="font-semibold text-lg">Academic Reading Test</h3>
              <span className="bg-green-100 text-green-800 text-xs px-2 py-1 rounded-full">
                Available
              </span>
            </div>
            <p className="text-sm text-text-secondary mb-4">
              Test your reading comprehension with academic passages and various question types including True/False/Not Given and multiple choice.
            </p>
            <div className="flex items-center text-sm text-text-tertiary mb-4">
              <Clock className="h-4 w-4 mr-2" />
              <span>60 minutes</span>
            </div>
            <Button variant="primary" to="/exam/reading/start" fullWidth>
              Start Test
            </Button>
          </div>
        </div>

        {/* Writing Task 1 & 2 */}
        <div className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow">
          <div className="h-3 bg-purple-500 w-full"></div>
          <div className="p-6">
            <div className="flex justify-between items-start mb-3">
              <h3 className="font-semibold text-lg">Writing Task 1 & 2</h3>
              <span className="bg-green-100 text-green-800 text-xs px-2 py-1 rounded-full">
                Available
              </span>
            </div>
            <p className="text-sm text-text-secondary mb-4">
              Complete both writing tasks: Task 1 (chart/graph analysis, 150+ words) and Task 2 (essay writing, 250+ words).
            </p>
            <div className="flex items-center text-sm text-text-tertiary mb-4">
              <Clock className="h-4 w-4 mr-2" />
              <span>60 minutes</span>
            </div>
            <Button variant="primary" to="/exam/writing/start" fullWidth>
              Start Test
            </Button>
          </div>
        </div>

        {/* Speaking Interview */}
        <div className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow">
          <div className="h-3 bg-orange-500 w-full"></div>
          <div className="p-6">
            <div className="flex justify-between items-start mb-3">
              <h3 className="font-semibold text-lg">Speaking Interview</h3>
              <span className="bg-yellow-100 text-yellow-800 text-xs px-2 py-1 rounded-full">
                Coming Soon
              </span>
            </div>
            <p className="text-sm text-text-secondary mb-4">
              Simulated speaking interview with all three parts. Practice speaking skills with AI-powered assessment and feedback.
            </p>
            <div className="flex items-center text-sm text-text-tertiary mb-4">
              <Clock className="h-4 w-4 mr-2" />
              <span>15 minutes</span>
            </div>
            <Button variant="outline" disabled fullWidth>
              Start Test
            </Button>
          </div>
        </div>

        {/* Full Mock Test */}
        <div className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow md:col-span-2 lg:col-span-1">
          <div className="h-3 bg-primary w-full"></div>
          <div className="p-6">
            <div className="flex justify-between items-start mb-3">
              <h3 className="font-semibold text-lg">Full Mock Test</h3>
              <span className="bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded-full">
                Comprehensive
              </span>
            </div>
            <p className="text-sm text-text-secondary mb-4">
              Complete IELTS simulation with all four modules. Experience the full exam under timed conditions with detailed feedback.
            </p>
            <div className="flex items-center text-sm text-text-tertiary mb-4">
              <Clock className="h-4 w-4 mr-2" />
              <span>2 hours 45 minutes</span>
            </div>
            <Button variant="primary" to="/mock-test" fullWidth>
              Start Full Test
            </Button>
          </div>
        </div>
      </div>
      {/* Scheduled Exams */}
      <div className="bg-white p-6 rounded-lg shadow-md">
        <h2 className="text-lg font-semibold mb-4">Upcoming Scheduled Exams</h2>
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-text-secondary uppercase tracking-wider">
                  Exam Name
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-text-secondary uppercase tracking-wider">
                  Date
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-text-secondary uppercase tracking-wider">
                  Time
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-text-secondary uppercase tracking-wider">
                  Location
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-text-secondary uppercase tracking-wider">
                  Status
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              <tr>
                <td className="px-6 py-4 whitespace-nowrap font-medium">
                  Official IELTS Exam
                </td>
                <td className="px-6 py-4 whitespace-nowrap">July 15, 2023</td>
                <td className="px-6 py-4 whitespace-nowrap">9:00 AM</td>
                <td className="px-6 py-4 whitespace-nowrap">
                  British Council, City Center
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className="px-2 py-1 bg-blue-100 text-blue-800 rounded-full text-xs">
                    Confirmed
                  </span>
                </td>
              </tr>
              <tr>
                <td className="px-6 py-4 whitespace-nowrap font-medium">
                  Speaking Assessment
                </td>
                <td className="px-6 py-4 whitespace-nowrap">June 22, 2023</td>
                <td className="px-6 py-4 whitespace-nowrap">2:30 PM</td>
                <td className="px-6 py-4 whitespace-nowrap">Online (Zoom)</td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className="px-2 py-1 bg-yellow-100 text-yellow-800 rounded-full text-xs">
                    Pending
                  </span>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>;
};
export default Exams;