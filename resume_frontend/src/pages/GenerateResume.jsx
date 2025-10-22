import React, { useState } from "react";
import toast from "react-hot-toast";
import { FaBrain, FaTrash, FaPaperPlane } from "react-icons/fa";
import { generateResume } from "../api/ResumeService";
import TemplateSelector from "../components/TemplateSelector"; // Import the new component
import Resume from "../components/Resume"; // We will update this next

const GenerateResume = () => {
    const [data, setData] = useState(null);
    const [description, setDescription] = useState("");
    const [loading, setLoading] = useState(false);
    const [selectedTemplate, setSelectedTemplate] = useState('classic'); // Default template

    const handleGenerate = async () => {
        if (!description) {
            toast.error("Please enter a description about yourself.");
            return;
        }

        console.log(description);
        try {
            setLoading(true);
            const responseData = await generateResume(description);

            // We are simulating saving the resume here
            const user = JSON.parse(localStorage.getItem('user'));
            if (user) {
                const savedResumes = JSON.parse(localStorage.getItem(`resumes_${user.email}`)) || [];
                const newResume = {
                    id: Date.now(),
                    data: responseData.data,
                    templateId: selectedTemplate,
                    createdAt: new Date().toISOString(),
                };
                savedResumes.push(newResume);
                localStorage.setItem(`resumes_${user.email}`, JSON.stringify(savedResumes));
            }

            setData(responseData.data);
            toast.success("Resume Generated Successfully!");
        } catch (error) {
            console.log(error);
            toast.error("Error Generating Resume!");
        } finally {
            setLoading(false);
        }
    };

    const handleClear = () => {
        setDescription("");
    };

    if (data) {
        return (
            <div className="bg-base-100 min-h-screen p-4 md:p-10">
                <Resume data={data} templateId={selectedTemplate} />
                <div className="flex justify-center mt-6 gap-4">
                    <button onClick={() => setData(null)} className="btn btn-secondary">
                        Generate Another
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-base-100 flex flex-col items-center justify-center p-4">
            <div className="w-full max-w-4xl">
                <TemplateSelector onSelect={setSelectedTemplate} selectedTemplate={selectedTemplate} />

                <div className="card bg-neutral/80 backdrop-blur-md shadow-2xl border border-primary/20">
                    <div className="card-body">
                        <h1 className="text-3xl font-bold text-center mb-4 flex items-center justify-center gap-2">
                            <FaBrain className="text-primary" /> Describe Yourself
                        </h1>
                        <p className="mb-6 text-center text-gray-400">
                            Provide a detailed description, and our AI will craft a professional resume for you.
                        </p>
                        <textarea
                            disabled={loading}
                            className="textarea textarea-bordered w-full h-48 mb-6 bg-base-100/50"
                            placeholder="For example: I am a software engineer with 5 years of experience in React and Node.js..."
                            value={description}
                            onChange={(e) => setDescription(e.target.value)}
                        ></textarea>
                        <div className="flex justify-center gap-4">
                            <button
                                disabled={loading}
                                onClick={handleGenerate}
                                className="btn btn-primary btn-lg"
                            >
                                {loading ? <span className="loading loading-spinner"></span> : <FaPaperPlane />}
                                Generate Resume
                            </button>
                            <button
                                onClick={handleClear}
                                className="btn btn-ghost"
                            >
                                <FaTrash /> Clear
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default GenerateResume;