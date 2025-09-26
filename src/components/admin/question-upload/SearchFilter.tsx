import React, { useState } from 'react';
import { SearchIcon, FilterIcon, DownloadIcon, UploadIcon } from 'lucide-react';
const SearchFilter: React.FC = () => {
  const [showFilters, setShowFilters] = useState(false);
  return <div className="bg-white rounded-lg shadow-md p-4 mb-6">
      <div className="flex flex-col md:flex-row gap-4">
        <div className="relative flex-grow">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <SearchIcon className="h-5 w-5 text-gray-400" />
          </div>
          <input type="text" placeholder="Search questions..." className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-primary focus:border-primary" />
        </div>
        <div className="flex flex-wrap gap-2">
          <button onClick={() => setShowFilters(!showFilters)} className="flex items-center px-3 py-2 border border-gray-300 rounded-md text-text-secondary hover:bg-gray-50">
            <FilterIcon className="h-4 w-4 mr-2" />
            Filters
          </button>
          <button className="flex items-center px-3 py-2 border border-gray-300 rounded-md text-text-secondary hover:bg-gray-50">
            <UploadIcon className="h-4 w-4 mr-2" />
            Bulk Upload
          </button>
          <button className="flex items-center px-3 py-2 border border-gray-300 rounded-md text-text-secondary hover:bg-gray-50">
            <DownloadIcon className="h-4 w-4 mr-2" />
            Export
          </button>
        </div>
      </div>
      {showFilters && <div className="mt-4 pt-4 border-t border-gray-200 grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label className="block text-sm font-medium text-text-secondary mb-1">
              Module
            </label>
            <select className="form-input w-full">
              <option value="">All Modules</option>
              <option value="listening">Listening</option>
              <option value="reading">Reading</option>
              <option value="writing">Writing</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-text-secondary mb-1">
              Section
            </label>
            <select className="form-input w-full">
              <option value="">All Sections</option>
              <option value="1">Section 1</option>
              <option value="2">Section 2</option>
              <option value="3">Section 3</option>
              <option value="4">Section 4</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-text-secondary mb-1">
              Question Type
            </label>
            <select className="form-input w-full">
              <option value="">All Types</option>
              <option value="multiple-choice">Multiple Choice</option>
              <option value="matching">Matching</option>
              <option value="completion">Completion</option>
              <option value="short-answer">Short Answer</option>
            </select>
          </div>
        </div>}
    </div>;
};
export default SearchFilter;