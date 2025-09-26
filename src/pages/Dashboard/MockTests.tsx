import React, { useState } from 'react';
import { Calendar, CheckCircle, Clock, AlertCircle, Search } from 'lucide-react';
import Button from '../../components/ui/Button';
const MockTests: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedFilter, setSelectedFilter] = useState('all');
  const mockTests = [{
    id: 1,
    type: 'Full Mock Test',
    subtype: 'Academic',
    date: 'June 1, 2023',
    time: '10:00 AM',
    status: 'completed',
    score: '7.0'
  }, {
    id: 2,
    type: 'Reading & Listening',
    subtype: 'Practice Test',
    date: 'May 15, 2023',
    time: '2:00 PM',
    status: 'completed',
    score: '6.5'
  }, {
    id: 3,
    type: 'Writing Task 1 & 2',
    subtype: 'Practice Test',
    date: 'May 1, 2023',
    time: '11:00 AM',
    status: 'completed',
    score: '6.0'
  }, {
    id: 4,
    type: 'Speaking Practice',
    subtype: 'Mock Interview',
    date: 'April 15, 2023',
    time: '3:30 PM',
    status: 'completed',
    score: '7.5'
  }];
  const filteredTests = mockTests.filter(test => {
    const matchesSearch = test.type.toLowerCase().includes(searchTerm.toLowerCase()) || test.date.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesFilter = selectedFilter === 'all' || test.status === selectedFilter;
    return matchesSearch && matchesFilter;
  });
  return <div>
      <h1 className="text-2xl md:text-3xl font-bold mb-6">Mock Tests</h1>
      <div className="bg-white rounded-lg shadow-md p-6 mb-8">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-6">
          <div>
            <div className="flex items-center">
              <h2 className="text-xl font-semibold mb-2">
                Next Scheduled Test
              </h2>
              <span className="ml-3 px-3 py-1 bg-accent/10 text-accent text-sm font-medium rounded-full">
                Academic IELTS
              </span>
            </div>
            <p className="text-text-secondary">
              Complete the full IELTS test under exam conditions.
            </p>
          </div>
          <div className="mt-4 md:mt-0 flex items-center">
            <div className="bg-accent/10 text-accent px-4 py-2 rounded-md font-medium flex items-center">
              <Clock className="h-5 w-5 mr-2" />
              <span>Starts in 2 days</span>
            </div>
          </div>
        </div>
        <div className="bg-secondary p-6 rounded-lg mb-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            <div>
              <p className="text-sm text-text-tertiary mb-1">Test Type</p>
              <p className="font-semibold">Full IELTS Mock Test</p>
            </div>
            <div>
              <p className="text-sm text-text-tertiary mb-1">Date</p>
              <div className="flex items-center">
                <Calendar className="h-4 w-4 mr-2 text-primary" />
                <p className="font-semibold">June 15, 2023</p>
              </div>
            </div>
            <div>
              <p className="text-sm text-text-tertiary mb-1">Time</p>
              <div className="flex items-center">
                <Clock className="h-4 w-4 mr-2 text-primary" />
                <p className="font-semibold">10:00 AM - 1:00 PM</p>
              </div>
            </div>
            <div>
              <p className="text-sm text-text-tertiary mb-1">Duration</p>
              <p className="font-semibold">3 hours</p>
            </div>
          </div>
        </div>
        <div className="space-y-4 mb-6">
          <div className="flex items-center">
            <CheckCircle className="h-5 w-5 text-success mr-3" />
            <span>You have completed all pre-test requirements</span>
          </div>
          <div className="flex items-center">
            <CheckCircle className="h-5 w-5 text-success mr-3" />
            <span>Your system meets the technical requirements</span>
          </div>
          <div className="flex items-center">
            <CheckCircle className="h-5 w-5 text-success mr-3" />
            <span>Your speaking test appointment is confirmed</span>
          </div>
        </div>
        <div className="flex flex-col sm:flex-row gap-4">
          <Button variant="primary" to="/mock-test" className="flex-1">
            Verify & Start Test
          </Button>
          <Button variant="outline" to="#system-check" className="flex-1">
            Run System Check
          </Button>
        </div>
      </div>
      <div className="mb-6">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-4">
          <h2 className="text-xl font-semibold">Past Test History</h2>
          <div className="mt-3 md:mt-0 flex flex-col sm:flex-row gap-3">
            <div className="relative">
              <input type="text" placeholder="Search tests..." value={searchTerm} onChange={e => setSearchTerm(e.target.value)} className="pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent w-full" aria-label="Search tests" />
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
            </div>
            <select value={selectedFilter} onChange={e => setSelectedFilter(e.target.value)} className="px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent" aria-label="Filter tests by status">
              <option value="all">All Tests</option>
              <option value="completed">Completed</option>
              <option value="scheduled">Scheduled</option>
              <option value="cancelled">Cancelled</option>
            </select>
          </div>
        </div>
        <div className="bg-white rounded-lg shadow-md overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full" aria-label="Past test results">
              <thead className="bg-gray-50">
                <tr>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-text-secondary uppercase tracking-wider">
                    Test Type
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-text-secondary uppercase tracking-wider">
                    Date
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-text-secondary uppercase tracking-wider">
                    Status
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-text-secondary uppercase tracking-wider">
                    Score
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-text-secondary uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {filteredTests.length > 0 ? filteredTests.map(test => <tr key={test.id}>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="font-medium">{test.type}</div>
                        <div className="text-sm text-text-tertiary">
                          {test.subtype}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="font-medium">{test.date}</div>
                        <div className="text-sm text-text-tertiary">
                          {test.time}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className="px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800">
                          Completed
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="font-medium">{test.score}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm">
                        <Button variant="outline" size="sm" to={`/dashboard/results?test=${test.id}`}>
                          View Results
                        </Button>
                      </td>
                    </tr>) : <tr>
                    <td colSpan={5} className="px-6 py-4 text-center text-text-secondary">
                      <div className="flex flex-col items-center py-6">
                        <AlertCircle className="h-12 w-12 text-text-tertiary mb-3" />
                        <p className="font-medium">No tests found</p>
                        <p className="text-sm text-text-tertiary mt-1">
                          Try adjusting your search or filter criteria
                        </p>
                      </div>
                    </td>
                  </tr>}
              </tbody>
            </table>
          </div>
        </div>
      </div>
      <div className="mt-8 bg-primary/5 border border-primary/10 rounded-lg p-6">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between">
          <div className="mb-4 md:mb-0">
            <h2 className="text-lg font-semibold text-primary mb-2">
              Practice Tests Available
            </h2>
            <p className="text-text-secondary">
              Take additional practice tests to improve your skills.
            </p>
          </div>
          <Button variant="secondary" to="/dashboard/practice-tests">
            View Practice Tests
          </Button>
        </div>
      </div>
    </div>;
};
export default MockTests;