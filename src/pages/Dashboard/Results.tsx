import React, { useState } from 'react';
import { ArrowUp, Download, Filter, ChevronDown, ChevronUp, Calendar, BarChart, Award } from 'lucide-react';
import Button from '../../components/ui/Button';
const Results: React.FC = () => {
  const [showFilters, setShowFilters] = useState(false);
  const [selectedTest, setSelectedTest] = useState<string | null>(null);
  const testOptions = [{
    id: 'latest',
    name: 'Latest Test (June 1, 2023)'
  }, {
    id: 'may15',
    name: 'Reading & Listening (May 15, 2023)'
  }, {
    id: 'may1',
    name: 'Writing Tasks (May 1, 2023)'
  }, {
    id: 'april15',
    name: 'Speaking Practice (April 15, 2023)'
  }, {
    id: 'april1',
    name: 'Full Mock Test (April 1, 2023)'
  }];
  return <div>
      <h1 className="text-xl sm:text-2xl md:text-3xl font-bold mb-4 sm:mb-6">
        Test Results
      </h1>
      {/* Overall Performance Summary */}
      <div className="bg-white p-4 sm:p-6 rounded-lg shadow-md mb-6 sm:mb-8">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-4 sm:mb-6">
          <div>
            <h2 className="text-lg sm:text-xl font-semibold">
              Overall Performance
            </h2>
            <p className="text-text-secondary text-xs sm:text-sm">
              Your IELTS journey progress
            </p>
          </div>
          <div className="mt-3 md:mt-0">
            <Button variant="outline" size="sm" className="flex items-center text-xs sm:text-sm">
              <Download className="h-3 w-3 sm:h-4 sm:w-4 mr-1 sm:mr-2" />
              Download Report
            </Button>
          </div>
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-2 sm:gap-4 mb-4 sm:mb-6">
          <div className="bg-primary text-white p-3 sm:p-4 rounded-lg text-center">
            <p className="text-xs sm:text-sm mb-0.5 sm:mb-1">Current Band</p>
            <p className="text-xl sm:text-2xl md:text-3xl font-bold">7.0</p>
            <div className="mt-1 inline-flex items-center text-xs bg-white/20 px-1.5 sm:px-2 py-0.5 rounded-full">
              <ArrowUp className="h-2.5 w-2.5 sm:h-3 sm:w-3 mr-0.5 sm:mr-1" />
              <span className="text-xs">+1.0 from start</span>
            </div>
          </div>
          <div className="bg-secondary p-3 sm:p-4 rounded-lg text-center">
            <p className="text-xs sm:text-sm text-text-tertiary mb-0.5 sm:mb-1">
              Listening
            </p>
            <p className="text-lg sm:text-xl md:text-2xl font-bold">7.5</p>
            <div className="mt-1 inline-flex items-center text-xs bg-green-100 text-green-800 px-1.5 sm:px-2 py-0.5 rounded-full">
              <ArrowUp className="h-2.5 w-2.5 sm:h-3 sm:w-3 mr-0.5 sm:mr-1" />
              <span className="text-xs">+0.5</span>
            </div>
          </div>
          <div className="bg-secondary p-3 sm:p-4 rounded-lg text-center">
            <p className="text-xs sm:text-sm text-text-tertiary mb-0.5 sm:mb-1">
              Reading
            </p>
            <p className="text-lg sm:text-xl md:text-2xl font-bold">6.5</p>
            <div className="mt-1 inline-flex items-center text-xs bg-green-100 text-green-800 px-1.5 sm:px-2 py-0.5 rounded-full">
              <ArrowUp className="h-2.5 w-2.5 sm:h-3 sm:w-3 mr-0.5 sm:mr-1" />
              <span className="text-xs">+0.5</span>
            </div>
          </div>
          <div className="bg-secondary p-3 sm:p-4 rounded-lg text-center">
            <p className="text-xs sm:text-sm text-text-tertiary mb-0.5 sm:mb-1">
              Writing
            </p>
            <p className="text-lg sm:text-xl md:text-2xl font-bold">6.5</p>
            <div className="mt-1 inline-flex items-center text-xs bg-green-100 text-green-800 px-1.5 sm:px-2 py-0.5 rounded-full">
              <ArrowUp className="h-2.5 w-2.5 sm:h-3 sm:w-3 mr-0.5 sm:mr-1" />
              <span className="text-xs">+1.0</span>
            </div>
          </div>
          <div className="bg-secondary p-3 sm:p-4 rounded-lg text-center">
            <p className="text-xs sm:text-sm text-text-tertiary mb-0.5 sm:mb-1">
              Speaking
            </p>
            <p className="text-lg sm:text-xl md:text-2xl font-bold">7.5</p>
            <div className="mt-1 inline-flex items-center text-xs bg-gray-200 text-gray-800 px-1.5 sm:px-2 py-0.5 rounded-full">
              <span className="text-xs">No change</span>
            </div>
          </div>
        </div>
        {/* Band Score Chart Placeholder */}
        <div className="bg-secondary p-3 sm:p-4 rounded-lg">
          <h3 className="font-medium text-sm sm:text-base mb-2 sm:mb-4">
            Band Score Progress
          </h3>
          <div className="h-32 sm:h-40 relative" aria-label="Band score progress chart">
            <div className="absolute inset-0 flex items-center justify-center">
              <p className="text-text-secondary italic text-xs sm:text-sm">
                Band score progress chart would be displayed here
              </p>
            </div>
          </div>
        </div>
      </div>
      {/* Recent Test Results */}
      <div className="mb-6 sm:mb-8">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-3 sm:mb-4 gap-2 sm:gap-0">
          <h2 className="text-base sm:text-lg font-semibold">
            Recent Test Results
          </h2>
          <Button variant="outline" size="sm" onClick={() => setShowFilters(!showFilters)} className="flex items-center text-xs sm:text-sm">
            <Filter className="h-3 w-3 sm:h-4 sm:w-4 mr-1 sm:mr-2" />
            Filter Results
            {showFilters ? <ChevronUp className="h-3 w-3 sm:h-4 sm:w-4 ml-1 sm:ml-2" /> : <ChevronDown className="h-3 w-3 sm:h-4 sm:w-4 ml-1 sm:ml-2" />}
          </Button>
        </div>
        {showFilters && <div className="bg-white p-3 sm:p-4 rounded-lg shadow-md mb-3 sm:mb-4">
            <p className="text-xs sm:text-sm font-medium mb-2">
              Select a test to view results:
            </p>
            <div className="space-y-1 sm:space-y-2">
              {testOptions.map(option => <div key={option.id} className={`p-1.5 sm:p-2 rounded cursor-pointer hover:bg-gray-100 flex items-center ${selectedTest === option.id ? 'bg-primary/10 border border-primary/20' : ''}`} onClick={() => setSelectedTest(option.id)}>
                  <input type="radio" id={option.id} name="testSelect" checked={selectedTest === option.id} onChange={() => setSelectedTest(option.id)} className="h-3 w-3 sm:h-4 sm:w-4 text-primary focus:ring-primary border-gray-300" />
                  <label htmlFor={option.id} className="ml-2 block text-xs sm:text-sm cursor-pointer">
                    {option.name}
                  </label>
                </div>)}
            </div>
            <div className="mt-3 sm:mt-4 flex justify-end">
              <Button variant="primary" size="sm" onClick={() => setShowFilters(false)} className="text-xs sm:text-sm">
                Apply
              </Button>
            </div>
          </div>}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
          {/* Full Mock Test Result Card */}
          <div className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow">
            <div className="h-1.5 sm:h-2 bg-primary w-full"></div>
            <div className="p-4 sm:p-6">
              <div className="flex justify-between items-start mb-2 sm:mb-3">
                <h3 className="font-semibold text-sm sm:text-base">
                  Full Mock Test
                </h3>
                <span className="text-xs sm:text-sm text-text-tertiary flex items-center">
                  <Calendar className="h-3 w-3 sm:h-4 sm:w-4 mr-0.5 sm:mr-1" />
                  June 1, 2023
                </span>
              </div>
              <div className="flex items-center justify-center bg-primary/5 rounded-lg p-2 sm:p-3 mb-3 sm:mb-4">
                <div className="text-center">
                  <p className="text-xs sm:text-sm text-text-tertiary">
                    Overall Band
                  </p>
                  <p className="text-xl sm:text-2xl md:text-3xl font-bold text-primary">
                    7.0
                  </p>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-2 sm:gap-3 mb-3 sm:mb-4">
                <div className="text-center p-1.5 sm:p-2 bg-secondary rounded">
                  <p className="text-xs text-text-tertiary">Listening</p>
                  <p className="font-semibold text-sm sm:text-base">7.5</p>
                </div>
                <div className="text-center p-1.5 sm:p-2 bg-secondary rounded">
                  <p className="text-xs text-text-tertiary">Reading</p>
                  <p className="font-semibold text-sm sm:text-base">6.5</p>
                </div>
                <div className="text-center p-1.5 sm:p-2 bg-secondary rounded">
                  <p className="text-xs text-text-tertiary">Writing</p>
                  <p className="font-semibold text-sm sm:text-base">6.5</p>
                </div>
                <div className="text-center p-1.5 sm:p-2 bg-secondary rounded">
                  <p className="text-xs text-text-tertiary">Speaking</p>
                  <p className="font-semibold text-sm sm:text-base">7.5</p>
                </div>
              </div>
              <Button variant="outline" to="/dashboard/results/mock-june1" fullWidth size="sm" className="text-xs sm:text-sm">
                View Detailed Report
              </Button>
            </div>
          </div>
          {/* Reading & Listening Test Card */}
          <div className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow">
            <div className="h-1.5 sm:h-2 bg-accent w-full"></div>
            <div className="p-4 sm:p-6">
              <div className="flex justify-between items-start mb-2 sm:mb-3">
                <h3 className="font-semibold text-sm sm:text-base">
                  Reading & Listening Test
                </h3>
                <span className="text-xs sm:text-sm text-text-tertiary flex items-center">
                  <Calendar className="h-3 w-3 sm:h-4 sm:w-4 mr-0.5 sm:mr-1" />
                  May 15, 2023
                </span>
              </div>
              <div className="flex items-center justify-around bg-accent/5 rounded-lg p-2 sm:p-3 mb-3 sm:mb-4">
                <div className="text-center px-2 sm:px-4">
                  <p className="text-xs sm:text-sm text-text-tertiary">
                    Reading
                  </p>
                  <p className="text-lg sm:text-xl md:text-2xl font-bold text-accent">
                    6.0
                  </p>
                </div>
                <div className="h-8 sm:h-10 border-r border-gray-300"></div>
                <div className="text-center px-2 sm:px-4">
                  <p className="text-xs sm:text-sm text-text-tertiary">
                    Listening
                  </p>
                  <p className="text-lg sm:text-xl md:text-2xl font-bold text-accent">
                    7.0
                  </p>
                </div>
              </div>
              <div className="mb-3 sm:mb-4">
                <p className="text-xs sm:text-sm font-medium mb-1">
                  Areas for Improvement:
                </p>
                <ul className="text-xs sm:text-sm text-text-secondary list-disc list-inside">
                  <li>Skimming and scanning techniques</li>
                  <li>Note-taking during lectures</li>
                  <li>Multiple choice questions</li>
                </ul>
              </div>
              <Button variant="outline" to="/dashboard/results/reading-listening-may15" fullWidth size="sm" className="text-xs sm:text-sm">
                View Detailed Report
              </Button>
            </div>
          </div>
          {/* Writing Test Card */}
          <div className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow">
            <div className="h-1.5 sm:h-2 bg-primary w-full"></div>
            <div className="p-4 sm:p-6">
              <div className="flex justify-between items-start mb-2 sm:mb-3">
                <h3 className="font-semibold text-sm sm:text-base">
                  Writing Tasks
                </h3>
                <span className="text-xs sm:text-sm text-text-tertiary flex items-center">
                  <Calendar className="h-3 w-3 sm:h-4 sm:w-4 mr-0.5 sm:mr-1" />
                  May 1, 2023
                </span>
              </div>
              <div className="flex items-center justify-center bg-primary/5 rounded-lg p-2 sm:p-3 mb-3 sm:mb-4">
                <div className="text-center">
                  <p className="text-xs sm:text-sm text-text-tertiary">
                    Writing Band
                  </p>
                  <p className="text-xl sm:text-2xl md:text-3xl font-bold text-primary">
                    6.0
                  </p>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-2 sm:gap-3 mb-3 sm:mb-4">
                <div className="text-center p-1.5 sm:p-2 bg-secondary rounded">
                  <p className="text-xs text-text-tertiary">Task 1</p>
                  <p className="font-semibold text-sm sm:text-base">5.5</p>
                </div>
                <div className="text-center p-1.5 sm:p-2 bg-secondary rounded">
                  <p className="text-xs text-text-tertiary">Task 2</p>
                  <p className="font-semibold text-sm sm:text-base">6.5</p>
                </div>
                <div className="text-center p-1.5 sm:p-2 bg-secondary rounded">
                  <p className="text-xs text-text-tertiary">Grammar</p>
                  <p className="font-semibold text-sm sm:text-base">6.0</p>
                </div>
                <div className="text-center p-1.5 sm:p-2 bg-secondary rounded">
                  <p className="text-xs text-text-tertiary">Vocabulary</p>
                  <p className="font-semibold text-sm sm:text-base">6.5</p>
                </div>
              </div>
              <Button variant="outline" to="/dashboard/results/writing-may1" fullWidth size="sm" className="text-xs sm:text-sm">
                View Detailed Report
              </Button>
            </div>
          </div>
          {/* Speaking Test Card */}
          <div className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow">
            <div className="h-1.5 sm:h-2 bg-accent w-full"></div>
            <div className="p-4 sm:p-6">
              <div className="flex justify-between items-start mb-2 sm:mb-3">
                <h3 className="font-semibold text-sm sm:text-base">
                  Speaking Practice
                </h3>
                <span className="text-xs sm:text-sm text-text-tertiary flex items-center">
                  <Calendar className="h-3 w-3 sm:h-4 sm:w-4 mr-0.5 sm:mr-1" />
                  April 15, 2023
                </span>
              </div>
              <div className="flex items-center justify-center bg-accent/5 rounded-lg p-2 sm:p-3 mb-3 sm:mb-4">
                <div className="text-center">
                  <p className="text-xs sm:text-sm text-text-tertiary">
                    Speaking Band
                  </p>
                  <p className="text-xl sm:text-2xl md:text-3xl font-bold text-accent">
                    7.5
                  </p>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-2 sm:gap-3 mb-3 sm:mb-4">
                <div className="text-center p-1.5 sm:p-2 bg-secondary rounded">
                  <p className="text-xs text-text-tertiary">Fluency</p>
                  <p className="font-semibold text-sm sm:text-base">7.5</p>
                </div>
                <div className="text-center p-1.5 sm:p-2 bg-secondary rounded">
                  <p className="text-xs text-text-tertiary">Vocabulary</p>
                  <p className="font-semibold text-sm sm:text-base">7.5</p>
                </div>
                <div className="text-center p-1.5 sm:p-2 bg-secondary rounded">
                  <p className="text-xs text-text-tertiary">Grammar</p>
                  <p className="font-semibold text-sm sm:text-base">7.0</p>
                </div>
                <div className="text-center p-1.5 sm:p-2 bg-secondary rounded">
                  <p className="text-xs text-text-tertiary">Pronunciation</p>
                  <p className="font-semibold text-sm sm:text-base">8.0</p>
                </div>
              </div>
              <Button variant="outline" to="/dashboard/results/speaking-april15" fullWidth size="sm" className="text-xs sm:text-sm">
                View Detailed Report
              </Button>
            </div>
          </div>
          {/* Previous Mock Test Card */}
          <div className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow">
            <div className="h-1.5 sm:h-2 bg-primary w-full"></div>
            <div className="p-4 sm:p-6">
              <div className="flex justify-between items-start mb-2 sm:mb-3">
                <h3 className="font-semibold text-sm sm:text-base">
                  Full Mock Test
                </h3>
                <span className="text-xs sm:text-sm text-text-tertiary flex items-center">
                  <Calendar className="h-3 w-3 sm:h-4 sm:w-4 mr-0.5 sm:mr-1" />
                  April 1, 2023
                </span>
              </div>
              <div className="flex items-center justify-center bg-primary/5 rounded-lg p-2 sm:p-3 mb-3 sm:mb-4">
                <div className="text-center">
                  <p className="text-xs sm:text-sm text-text-tertiary">
                    Overall Band
                  </p>
                  <p className="text-xl sm:text-2xl md:text-3xl font-bold text-primary">
                    6.0
                  </p>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-2 sm:gap-3 mb-3 sm:mb-4">
                <div className="text-center p-1.5 sm:p-2 bg-secondary rounded">
                  <p className="text-xs text-text-tertiary">Listening</p>
                  <p className="font-semibold text-sm sm:text-base">6.5</p>
                </div>
                <div className="text-center p-1.5 sm:p-2 bg-secondary rounded">
                  <p className="text-xs text-text-tertiary">Reading</p>
                  <p className="font-semibold text-sm sm:text-base">5.5</p>
                </div>
                <div className="text-center p-1.5 sm:p-2 bg-secondary rounded">
                  <p className="text-xs text-text-tertiary">Writing</p>
                  <p className="font-semibold text-sm sm:text-base">5.5</p>
                </div>
                <div className="text-center p-1.5 sm:p-2 bg-secondary rounded">
                  <p className="text-xs text-text-tertiary">Speaking</p>
                  <p className="font-semibold text-sm sm:text-base">7.0</p>
                </div>
              </div>
              <Button variant="outline" to="/dashboard/results/mock-april1" fullWidth size="sm" className="text-xs sm:text-sm">
                View Detailed Report
              </Button>
            </div>
          </div>
          {/* Vocabulary Test Card */}
          <div className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow">
            <div className="h-1.5 sm:h-2 bg-accent w-full"></div>
            <div className="p-4 sm:p-6">
              <div className="flex justify-between items-start mb-2 sm:mb-3">
                <h3 className="font-semibold text-sm sm:text-base">
                  Academic Vocabulary Quiz
                </h3>
                <span className="text-xs sm:text-sm text-text-tertiary flex items-center">
                  <Calendar className="h-3 w-3 sm:h-4 sm:w-4 mr-0.5 sm:mr-1" />
                  March 20, 2023
                </span>
              </div>
              <div className="flex items-center justify-center bg-accent/5 rounded-lg p-2 sm:p-3 mb-3 sm:mb-4">
                <div className="text-center">
                  <p className="text-xs sm:text-sm text-text-tertiary">Score</p>
                  <p className="text-xl sm:text-2xl md:text-3xl font-bold text-accent">
                    85%
                  </p>
                </div>
              </div>
              <div className="mb-3 sm:mb-4">
                <p className="text-xs sm:text-sm font-medium mb-1">
                  Performance:
                </p>
                <div className="w-full bg-gray-200 rounded-full h-1.5 sm:h-2.5 mb-1 sm:mb-2">
                  <div className="bg-accent h-1.5 sm:h-2.5 rounded-full" style={{
                  width: '85%'
                }} role="progressbar" aria-valuenow={85} aria-valuemin={0} aria-valuemax={100}></div>
                </div>
                <p className="text-xs sm:text-sm text-text-secondary">
                  Strong in academic terms, needs improvement in topic-specific
                  vocabulary.
                </p>
              </div>
              <Button variant="outline" to="/dashboard/results/vocabulary-march20" fullWidth size="sm" className="text-xs sm:text-sm">
                View Detailed Report
              </Button>
            </div>
          </div>
        </div>
      </div>
      {/* Achievements Section */}
      <div className="bg-white rounded-lg shadow-md p-4 sm:p-6 mb-6 sm:mb-8">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-3 sm:mb-4 gap-2 sm:gap-0">
          <h2 className="text-base sm:text-lg font-semibold flex items-center">
            <Award className="h-4 w-4 sm:h-5 sm:w-5 text-accent mr-1.5 sm:mr-2" />
            Your Achievements
          </h2>
          <Button variant="outline" size="sm" to="/dashboard/achievements" className="text-xs sm:text-sm">
            View All
          </Button>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3 sm:gap-4">
          <div className="bg-primary/5 p-3 sm:p-4 rounded-lg border border-primary/20 flex items-center">
            <div className="h-8 w-8 sm:h-12 sm:w-12 bg-primary rounded-full flex items-center justify-center text-white mr-3 sm:mr-4">
              <Award className="h-4 w-4 sm:h-6 sm:w-6" />
            </div>
            <div>
              <p className="font-medium text-xs sm:text-sm">Band 7 Achiever</p>
              <p className="text-xs text-text-tertiary">
                Reached band 7.0 overall
              </p>
            </div>
          </div>
          <div className="bg-accent/5 p-3 sm:p-4 rounded-lg border border-accent/20 flex items-center">
            <div className="h-8 w-8 sm:h-12 sm:w-12 bg-accent rounded-full flex items-center justify-center text-white mr-3 sm:mr-4">
              <Award className="h-4 w-4 sm:h-6 sm:w-6" />
            </div>
            <div>
              <p className="font-medium text-xs sm:text-sm">Speaking Star</p>
              <p className="text-xs text-text-tertiary">
                Achieved 7.5 in Speaking
              </p>
            </div>
          </div>
          <div className="bg-gray-100 p-3 sm:p-4 rounded-lg border border-gray-200 flex items-center">
            <div className="h-8 w-8 sm:h-12 sm:w-12 bg-gray-400 rounded-full flex items-center justify-center text-white mr-3 sm:mr-4">
              <BarChart className="h-4 w-4 sm:h-6 sm:w-6" />
            </div>
            <div>
              <p className="font-medium text-xs sm:text-sm">
                Consistent Improver
              </p>
              <p className="text-xs text-text-tertiary">
                5 consecutive score improvements
              </p>
            </div>
          </div>
        </div>
      </div>
      {/* All Tests Table */}
      <div className="bg-white rounded-lg shadow-md overflow-hidden">
        <div className="px-4 sm:px-6 py-3 sm:py-4 border-b flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2 sm:gap-0">
          <h2 className="text-base sm:text-lg font-semibold">
            Complete Test History
          </h2>
          <Button variant="outline" size="sm" className="text-xs sm:text-sm">
            <Download className="h-3 w-3 sm:h-4 sm:w-4 mr-1 sm:mr-2" />
            Export All
          </Button>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full" aria-label="Test result history">
            <thead className="bg-gray-50">
              <tr>
                <th scope="col" className="px-3 sm:px-6 py-2 sm:py-3 text-left text-xs font-medium text-text-secondary uppercase tracking-wider">
                  Test Date
                </th>
                <th scope="col" className="px-3 sm:px-6 py-2 sm:py-3 text-left text-xs font-medium text-text-secondary uppercase tracking-wider">
                  Test Type
                </th>
                <th scope="col" className="px-3 sm:px-6 py-2 sm:py-3 text-left text-xs font-medium text-text-secondary uppercase tracking-wider">
                  Listening
                </th>
                <th scope="col" className="px-3 sm:px-6 py-2 sm:py-3 text-left text-xs font-medium text-text-secondary uppercase tracking-wider">
                  Reading
                </th>
                <th scope="col" className="px-3 sm:px-6 py-2 sm:py-3 text-left text-xs font-medium text-text-secondary uppercase tracking-wider">
                  Writing
                </th>
                <th scope="col" className="px-3 sm:px-6 py-2 sm:py-3 text-left text-xs font-medium text-text-secondary uppercase tracking-wider">
                  Speaking
                </th>
                <th scope="col" className="px-3 sm:px-6 py-2 sm:py-3 text-left text-xs font-medium text-text-secondary uppercase tracking-wider">
                  Overall
                </th>
                <th scope="col" className="px-3 sm:px-6 py-2 sm:py-3 text-left text-xs font-medium text-text-secondary uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              <tr>
                <td className="px-3 sm:px-6 py-2 sm:py-4 whitespace-nowrap text-xs sm:text-sm">
                  June 1, 2023
                </td>
                <td className="px-3 sm:px-6 py-2 sm:py-4 whitespace-nowrap text-xs sm:text-sm">
                  Full Mock Test
                </td>
                <td className="px-3 sm:px-6 py-2 sm:py-4 whitespace-nowrap text-xs sm:text-sm">
                  7.5
                </td>
                <td className="px-3 sm:px-6 py-2 sm:py-4 whitespace-nowrap text-xs sm:text-sm">
                  6.5
                </td>
                <td className="px-3 sm:px-6 py-2 sm:py-4 whitespace-nowrap text-xs sm:text-sm">
                  6.5
                </td>
                <td className="px-3 sm:px-6 py-2 sm:py-4 whitespace-nowrap text-xs sm:text-sm">
                  7.5
                </td>
                <td className="px-3 sm:px-6 py-2 sm:py-4 whitespace-nowrap font-medium text-xs sm:text-sm">
                  7.0
                </td>
                <td className="px-3 sm:px-6 py-2 sm:py-4 whitespace-nowrap text-xs">
                  <Button variant="outline" size="sm" className="text-xs">
                    View
                  </Button>
                </td>
              </tr>
              <tr>
                <td className="px-3 sm:px-6 py-2 sm:py-4 whitespace-nowrap text-xs sm:text-sm">
                  May 15, 2023
                </td>
                <td className="px-3 sm:px-6 py-2 sm:py-4 whitespace-nowrap text-xs sm:text-sm">
                  Practice Test
                </td>
                <td className="px-3 sm:px-6 py-2 sm:py-4 whitespace-nowrap text-xs sm:text-sm">
                  7.0
                </td>
                <td className="px-3 sm:px-6 py-2 sm:py-4 whitespace-nowrap text-xs sm:text-sm">
                  6.0
                </td>
                <td className="px-3 sm:px-6 py-2 sm:py-4 whitespace-nowrap text-xs sm:text-sm">
                  6.0
                </td>
                <td className="px-3 sm:px-6 py-2 sm:py-4 whitespace-nowrap text-xs sm:text-sm">
                  7.0
                </td>
                <td className="px-3 sm:px-6 py-2 sm:py-4 whitespace-nowrap font-medium text-xs sm:text-sm">
                  6.5
                </td>
                <td className="px-3 sm:px-6 py-2 sm:py-4 whitespace-nowrap text-xs">
                  <Button variant="outline" size="sm" className="text-xs">
                    View
                  </Button>
                </td>
              </tr>
              <tr>
                <td className="px-3 sm:px-6 py-2 sm:py-4 whitespace-nowrap text-xs sm:text-sm">
                  May 1, 2023
                </td>
                <td className="px-3 sm:px-6 py-2 sm:py-4 whitespace-nowrap text-xs sm:text-sm">
                  Writing Test
                </td>
                <td className="px-3 sm:px-6 py-2 sm:py-4 whitespace-nowrap text-xs sm:text-sm">
                  -
                </td>
                <td className="px-3 sm:px-6 py-2 sm:py-4 whitespace-nowrap text-xs sm:text-sm">
                  -
                </td>
                <td className="px-3 sm:px-6 py-2 sm:py-4 whitespace-nowrap text-xs sm:text-sm">
                  6.0
                </td>
                <td className="px-3 sm:px-6 py-2 sm:py-4 whitespace-nowrap text-xs sm:text-sm">
                  -
                </td>
                <td className="px-3 sm:px-6 py-2 sm:py-4 whitespace-nowrap font-medium text-xs sm:text-sm">
                  6.0
                </td>
                <td className="px-3 sm:px-6 py-2 sm:py-4 whitespace-nowrap text-xs">
                  <Button variant="outline" size="sm" className="text-xs">
                    View
                  </Button>
                </td>
              </tr>
              <tr>
                <td className="px-3 sm:px-6 py-2 sm:py-4 whitespace-nowrap text-xs sm:text-sm">
                  April 15, 2023
                </td>
                <td className="px-3 sm:px-6 py-2 sm:py-4 whitespace-nowrap text-xs sm:text-sm">
                  Speaking Test
                </td>
                <td className="px-3 sm:px-6 py-2 sm:py-4 whitespace-nowrap text-xs sm:text-sm">
                  -
                </td>
                <td className="px-3 sm:px-6 py-2 sm:py-4 whitespace-nowrap text-xs sm:text-sm">
                  -
                </td>
                <td className="px-3 sm:px-6 py-2 sm:py-4 whitespace-nowrap text-xs sm:text-sm">
                  -
                </td>
                <td className="px-3 sm:px-6 py-2 sm:py-4 whitespace-nowrap text-xs sm:text-sm">
                  7.5
                </td>
                <td className="px-3 sm:px-6 py-2 sm:py-4 whitespace-nowrap font-medium text-xs sm:text-sm">
                  7.5
                </td>
                <td className="px-3 sm:px-6 py-2 sm:py-4 whitespace-nowrap text-xs">
                  <Button variant="outline" size="sm" className="text-xs">
                    View
                  </Button>
                </td>
              </tr>
              <tr>
                <td className="px-3 sm:px-6 py-2 sm:py-4 whitespace-nowrap text-xs sm:text-sm">
                  April 1, 2023
                </td>
                <td className="px-3 sm:px-6 py-2 sm:py-4 whitespace-nowrap text-xs sm:text-sm">
                  Full Mock Test
                </td>
                <td className="px-3 sm:px-6 py-2 sm:py-4 whitespace-nowrap text-xs sm:text-sm">
                  6.5
                </td>
                <td className="px-3 sm:px-6 py-2 sm:py-4 whitespace-nowrap text-xs sm:text-sm">
                  5.5
                </td>
                <td className="px-3 sm:px-6 py-2 sm:py-4 whitespace-nowrap text-xs sm:text-sm">
                  5.5
                </td>
                <td className="px-3 sm:px-6 py-2 sm:py-4 whitespace-nowrap text-xs sm:text-sm">
                  7.0
                </td>
                <td className="px-3 sm:px-6 py-2 sm:py-4 whitespace-nowrap font-medium text-xs sm:text-sm">
                  6.0
                </td>
                <td className="px-3 sm:px-6 py-2 sm:py-4 whitespace-nowrap text-xs">
                  <Button variant="outline" size="sm" className="text-xs">
                    View
                  </Button>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>;
};
export default Results;