import React, { useState, useEffect } from 'react';
import { FaSearch, FaUserCircle, FaEnvelope, FaTrash } from 'react-icons/fa';
import useFetch from '../../hooks/useFetch';
import AnimatedPage from '../../components/common/AnimatedPage';
import SkeletonLoader from '../../components/common/SkeletonLoader';
import EmptyState from '../../components/common/EmptyState';
import toast from 'react-hot-toast';

const ManageStudents = () => {
  const [students, setStudents] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const { loading, fetchData } = useFetch();

  const getStudents = async () => {
    try {
      const data = await fetchData('/auth/students'); 
      setStudents(data.students || []);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    getStudents();
  }, []);

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to remove this student account?')) {
      try {
        await fetchData(`/auth/students/${id}`, 'delete');
        toast.success('Student account removed');
        getStudents();
      } catch (err) {
        console.error(err);
      }
    }
  };

  const filteredStudents = students.filter(student => 
    student.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    student.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    student.educationalBackground?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <AnimatedPage>
      <div className="space-y-8">
        <div>
          <h1 className="text-3xl font-bold text-textPrimary">Enrolled Students Directory</h1>
          <p className="text-textMuted mt-1">View and manage all registered student accounts across Indian colleges.</p>
        </div>

        <div className="glass-card p-6">
          <div className="flex items-center gap-4 mb-6 bg-background px-4 py-2 rounded-xl border border-border max-w-md">
            <FaSearch className="text-textMuted" />
            <input 
              type="text" 
              placeholder="Search by student name, email, or college..." 
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="bg-transparent border-none outline-none text-sm w-full text-textPrimary placeholder:text-textMuted"
            />
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead>
                <tr className="text-textMuted text-sm uppercase tracking-wider border-b border-border">
                  <th className="pb-4 px-4">Student</th>
                  <th className="pb-4 px-4 text-center">Registration Date</th>
                  <th className="pb-4 px-4 text-center">Status</th>
                  <th className="pb-4 px-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {loading ? (
                  <SkeletonLoader type="table-row" count={5} />
                ) : (
                  <>
                    {filteredStudents.map((student) => (
                      <tr key={student._id} className="group hover:bg-white/5 transition-colors">
                        <td className="py-4 px-4">
                          <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-full bg-accent/20 flex items-center justify-center text-accent">
                              {student.avatar ? (
                                <img src={student.avatar} alt="Avatar" className="w-full h-full rounded-full object-cover" />
                              ) : (
                                <FaUserCircle className="text-xl" />
                              )}
                            </div>
                            <div>
                              <p className="font-bold text-textPrimary">{student.name}</p>
                              <p className="text-[10px] text-textMuted flex items-center gap-1">
                                <FaEnvelope className="text-[8px]" /> {student.email}
                              </p>
                              {student.educationalBackground && (
                                <p className="text-[10px] text-accent/80 font-medium mt-0.5">
                                  {student.educationalBackground}
                                </p>
                              )}
                            </div>
                          </div>
                        </td>
                        <td className="py-4 px-4 text-center text-textMuted text-sm font-medium">
                          {new Date(student.createdAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}
                        </td>
                        <td className="py-4 px-4 text-center">
                          <span className="bg-green-500/10 text-green-500 px-2 py-1 rounded text-[10px] font-black uppercase tracking-widest">
                            Active
                          </span>
                        </td>
                        <td className="py-4 px-4 text-right">
                          <button 
                            onClick={() => handleDelete(student._id)}
                            className="p-2 hover:bg-red-400/10 text-textMuted hover:text-red-400 rounded-lg transition-all"
                          >
                            <FaTrash />
                          </button>
                        </td>
                      </tr>
                    ))}
                    {students.length === 0 && (
                      <tr>
                        <td colSpan="4">
                          <EmptyState 
                            icon="inbox" 
                            title="No Students Registered" 
                            message="Your student directory is currently empty." 
                          />
                        </td>
                      </tr>
                    )}
                  </>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </AnimatedPage>
  );
};

export default ManageStudents;
