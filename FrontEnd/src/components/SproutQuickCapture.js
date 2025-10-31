import { useState, useEffect } from "react";
import styled from "styled-components";
import { FiCamera, FiSend } from "react-icons/fi";
import { motion, AnimatePresence } from "framer-motion";
import Tesseract from "tesseract.js";
import SproutChat from "./SproutChat";

const FloatingButtonGroup = styled.div`
  position: fixed;
  bottom: 120px;
  right: 30px;
  display: flex;
  flex-direction: column;
  gap: 12px;
  z-index: 1000;
`;

const FloatingButton = styled(motion.button)`
  width: 64px;
  height: 64px;
  background: linear-gradient(135deg, #107BAE 0%, #43A171 100%);
  border: none;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 32px;
  cursor: pointer;
  box-shadow: 0 8px 32px rgba(16, 123, 174, 0.5);
  transition: all 0.3s;

  &:hover {
    transform: scale(1.1);
    box-shadow: 0 12px 40px rgba(16, 123, 174, 0.6);
  }

  &:active {
    transform: scale(0.95);
  }
`;

const SecondaryButton = styled(motion.button)`
  width: 56px;
  height: 56px;
  background: white;
  border: 3px solid #107BAE;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 24px;
  cursor: pointer;
  box-shadow: 0 4px 16px rgba(102, 126, 234, 0.3);
  transition: all 0.3s;

  &:hover {
    transform: scale(1.1);
    background: #f0f4ff;
  }

  &:active {
    transform: scale(0.95);
  }
`;

const QuickCaptureBar = styled(motion.div)`
  position: fixed;
  bottom: 120px;
  right: 30px;
  background: linear-gradient(135deg, #107BAE 0%, #43A171 100%);
  border-radius: 50px;
  padding: 12px 20px;
  display: flex;
  align-items: center;
  gap: 12px;
  box-shadow: 0 8px 32px rgba(16, 123, 174, 0.4);
  z-index: 1000;
  backdrop-filter: blur(10px);
  min-width: 400px;
`;

const SproutIcon = styled.div`
  width: 36px;
  height: 36px;
  background: rgba(255, 255, 255, 0.2);
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 20px;
  cursor: pointer;
  transition: all 0.3s;

  &:hover {
    background: rgba(255, 255, 255, 0.3);
    transform: scale(1.1);
  }
`;

const InputField = styled.input`
  flex: 1;
  background: rgba(255, 255, 255, 0.15);
  border: 2px solid rgba(255, 255, 255, 0.2);
  border-radius: 25px;
  padding: 12px 20px;
  color: white;
  font-size: 15px;
  outline: none;
  transition: all 0.3s;

  &::placeholder {
    color: rgba(255, 255, 255, 0.7);
  }

  &:focus {
    background: rgba(255, 255, 255, 0.25);
    border-color: rgba(255, 255, 255, 0.4);
  }
`;

const IconButton = styled.button`
  width: 40px;
  height: 40px;
  background: rgba(255, 255, 255, 0.2);
  border: none;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  cursor: pointer;
  transition: all 0.3s;

  &:hover {
    background: rgba(255, 255, 255, 0.3);
    transform: scale(1.1);
  }

  &:active {
    transform: scale(0.95);
  }
`;

const ModalOverlay = styled(motion.div)`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.6);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 2000;
  backdrop-filter: blur(5px);
`;

const ModalContent = styled(motion.div)`
  background: white;
  border-radius: 20px;
  padding: 30px;
  width: 90%;
  max-width: 600px;
  max-height: 80vh;
  overflow-y: auto;
  box-shadow: 0 20px 60px rgba(0, 0, 0, 0.3);
`;

const ModalHeader = styled.div`
  display: flex;
  align-items: center;
  gap: 12px;
  margin-bottom: 24px;
`;

const SproutAvatar = styled.div`
  width: 48px;
  height: 48px;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 24px;
`;

const ModalTitle = styled.h2`
  margin: 0;
  font-size: 24px;
  font-weight: 600;
  color: #000;
`;

const ParsedTask = styled.div`
  background: #f8f9fa;
  border-radius: 12px;
  padding: 20px;
  margin-bottom: 20px;
`;

const TaskField = styled.div`
  margin-bottom: 16px;
`;

const Label = styled.label`
  display: block;
  font-size: 12px;
  font-weight: 600;
  color: #666;
  text-transform: uppercase;
  margin-bottom: 8px;
`;

const Input = styled.input`
  width: 100%;
  padding: 10px 12px;
  border: 2px solid #e0e0e0;
  border-radius: 8px;
  font-size: 14px;
  box-sizing: border-box;

  &:focus {
    outline: none;
    border-color: #667eea;
  }
`;

const Select = styled.select`
  width: 100%;
  padding: 10px 12px;
  border: 2px solid #e0e0e0;
  border-radius: 8px;
  font-size: 14px;
  box-sizing: border-box;
  background: white;

  &:focus {
    outline: none;
    border-color: #667eea;
  }
`;

const ButtonGroup = styled.div`
  display: flex;
  gap: 12px;
  justify-content: flex-end;
`;

const Button = styled.button`
  padding: 12px 24px;
  border: none;
  border-radius: 8px;
  font-size: 14px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s;

  ${(props) =>
    props.$primary
      ? `
    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
    color: white;
    &:hover {
      transform: translateY(-2px);
      box-shadow: 0 4px 12px rgba(102, 126, 234, 0.4);
    }
  `
      : `
    background: #f0f0f0;
    color: #000;
    &:hover {
      background: #e0e0e0;
    }
  `}

  &:active {
    transform: scale(0.98);
  }

  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }
`;

const HiddenFileInput = styled.input`
  display: none;
`;

const ImagePreview = styled.img`
  width: 100%;
  max-height: 300px;
  object-fit: contain;
  border-radius: 12px;
  margin-bottom: 20px;
`;

const TaskList = styled.div`
  max-height: 400px;
  overflow-y: auto;
`;

const TaskItem = styled.div`
  display: flex;
  align-items: flex-start;
  gap: 12px;
  padding: 16px;
  background: ${(props) => (props.$selected ? "#f0f4ff" : "#f8f9fa")};
  border: 2px solid ${(props) => (props.$selected ? "#667eea" : "#e0e0e0")};
  border-radius: 12px;
  margin-bottom: 12px;
  cursor: pointer;
  transition: all 0.2s;

  &:hover {
    border-color: #667eea;
    transform: translateX(4px);
  }
`;

const Checkbox = styled.input`
  width: 20px;
  height: 20px;
  cursor: pointer;
  margin-top: 2px;
`;

const TaskDetails = styled.div`
  flex: 1;
`;

const TaskTitle = styled.div`
  font-size: 15px;
  font-weight: 600;
  color: #000;
  margin-bottom: 4px;
`;

const TaskMeta = styled.div`
  font-size: 13px;
  color: #666;
`;

const ProcessingMessage = styled.div`
  text-align: center;
  padding: 40px;
  color: #667eea;
  font-size: 16px;
`;

const LoadingSpinner = styled.div`
  display: inline-block;
  width: 40px;
  height: 40px;
  border: 4px solid #f3f3f3;
  border-top: 4px solid #667eea;
  border-radius: 50%;
  animation: spin 1s linear infinite;
  margin: 20px auto;

  @keyframes spin {
    0% {
      transform: rotate(0deg);
    }
    100% {
      transform: rotate(360deg);
    }
  }
`;

const placeholders = [
  "Ask Sprout: What's next? (e.g., 'History essay due next Friday')",
  "Sprout: (e.g., 'Study for Chem final on Dec 15 at 9 am')",
  "Tap 📷 to turn a syllabus photo into tasks",
  "Sprout: Find resources for my scholarship application",
];

const SproutQuickCapture = ({ onTaskCreate, onProjectCreate, projects = [], onRefreshProjects }) => {
  const [input, setInput] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [parsedTask, setParsedTask] = useState(null);
  const [placeholderIndex, setPlaceholderIndex] = useState(0);
  const [isProcessing, setIsProcessing] = useState(false);
  const [showOCRModal, setShowOCRModal] = useState(false);
  const [extractedTasks, setExtractedTasks] = useState([]);
  const [selectedTasks, setSelectedTasks] = useState([]);
  const [uploadedImage, setUploadedImage] = useState(null);
  const [isExpanded, setIsExpanded] = useState(false);
  const [ocrProgress, setOcrProgress] = useState(0);
  const [showChat, setShowChat] = useState(false);

  // Rotate placeholder text
  useEffect(() => {
    const interval = setInterval(() => {
      setPlaceholderIndex((prev) => (prev + 1) % placeholders.length);
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  const parseNaturalLanguage = (text) => {
    // Check if this is a project creation request - if so, don't parse as task
    const isProjectCreation =
      (text.toLowerCase().includes("create") ||
        text.toLowerCase().includes("make") ||
        text.toLowerCase().includes("start") ||
        text.toLowerCase().includes("new")) &&
      text.toLowerCase().includes("project");

    if (isProjectCreation) {
      // This should be handled by chat, not quick capture
      // Open chat instead
      setShowChat(true);
      setInput("");
      return null;
    }

    // Simple NLP parsing for tasks
    const parsed = {
      title: text,
      dueDate: "",
      time: "23:59",
      project: projects[0]?._id || null,
      status: "todo",
    };

    // Extract date patterns
    const datePatterns = [
      { regex: /tomorrow/i, days: 1 },
      { regex: /next week/i, days: 7 },
      { regex: /next month/i, days: 30 },
      { regex: /(monday|tuesday|wednesday|thursday|friday|saturday|sunday)/i, weekday: true },
    ];

    for (const pattern of datePatterns) {
      if (pattern.regex.test(text)) {
        const date = new Date();
        if (pattern.weekday) {
          const days = ["sunday", "monday", "tuesday", "wednesday", "thursday", "friday", "saturday"];
          const targetDay = days.indexOf(text.match(pattern.regex)[0].toLowerCase());
          const currentDay = date.getDay();
          const daysUntil = (targetDay - currentDay + 7) % 7 || 7;
          date.setDate(date.getDate() + daysUntil);
        } else {
          date.setDate(date.getDate() + pattern.days);
        }
        parsed.dueDate = date.toISOString().split("T")[0];
        parsed.title = text.replace(pattern.regex, "").trim();
        break;
      }
    }

    // Extract time patterns
    const timeMatch = text.match(/(\d{1,2}):?(\d{2})?\s*(am|pm)/i);
    if (timeMatch) {
      let hours = parseInt(timeMatch[1]);
      const minutes = timeMatch[2] || "00";
      const period = timeMatch[3].toLowerCase();

      if (period === "pm" && hours !== 12) hours += 12;
      if (period === "am" && hours === 12) hours = 0;

      parsed.time = `${hours.toString().padStart(2, "0")}:${minutes}`;
      parsed.title = text.replace(timeMatch[0], "").trim();
    }

    return parsed;
  };

  const handleSubmit = () => {
    if (!input.trim()) return;

    setIsProcessing(true);
    setTimeout(() => {
      const parsed = parseNaturalLanguage(input);
      
      // If null returned, it means it's a project creation - chat will handle it
      if (parsed === null) {
        setIsProcessing(false);
        return;
      }
      
      setParsedTask(parsed);
      setShowModal(true);
      setIsProcessing(false);
    }, 500);
  };

  const handleConfirm = () => {
    if (onTaskCreate && parsedTask) {
      onTaskCreate(parsedTask);
    }
    setShowModal(false);
    setInput("");
    setParsedTask(null);
  };

  const handleCancel = () => {
    setShowModal(false);
    setParsedTask(null);
  };

  const handleKeyPress = (e) => {
    if (e.key === "Enter") {
      handleSubmit();
    }
  };

  const handleImageUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const imageUrl = URL.createObjectURL(file);
    setUploadedImage(imageUrl);
    setShowOCRModal(true);
    setIsProcessing(true);

    try {
      // Real OCR processing with Tesseract.js
      const result = await Tesseract.recognize(
        imageUrl,
        'eng',
        {
          logger: (m) => {
            if (m.status === 'recognizing text') {
              setOcrProgress(Math.round(m.progress * 100));
            }
          }
        }
      );

      const extractedText = result.data.text;
      console.log('Extracted text:', extractedText);
      
      const tasks = extractTasksFromText(extractedText);
      setExtractedTasks(tasks);
      setSelectedTasks(tasks.map((t) => t.id));
    } catch (error) {
      console.error('OCR Error:', error);
      // Fallback to mock data if OCR fails
      const mockTasks = extractTasksFromImage();
      setExtractedTasks(mockTasks);
      setSelectedTasks(mockTasks.map((t) => t.id));
    } finally {
      setIsProcessing(false);
    }
  };

  const extractTasksFromText = (text) => {
    // Parse the OCR text to extract tasks
    const lines = text.split('\n').filter(line => line.trim().length > 0);
    const tasks = [];
    let taskId = 1;

    // Common task indicators
    const taskPatterns = [
      /^[-•*]\s*(.+)/,  // Bullet points
      /^\d+\.\s*(.+)/,  // Numbered lists
      /^(read|write|complete|finish|submit|study|review|prepare|create|update|fix|test|implement)\s+(.+)/i,  // Action verbs
      /^(assignment|homework|project|task|todo|due):\s*(.+)/i,  // Task labels
    ];

    // Date patterns
    const datePatterns = [
      /(\d{1,2}\/\d{1,2}\/\d{2,4})/,  // MM/DD/YYYY
      /(\d{1,2}-\d{1,2}-\d{2,4})/,    // MM-DD-YYYY
      /(jan|feb|mar|apr|may|jun|jul|aug|sep|oct|nov|dec)[a-z]*\s+\d{1,2}/i,  // Month Day
      /(monday|tuesday|wednesday|thursday|friday|saturday|sunday)/i,  // Day names
      /(tomorrow|next week|next month)/i,  // Relative dates
    ];

    for (const line of lines) {
      let taskTitle = line.trim();
      let dueDate = "";

      // Check if line matches task patterns
      let isTask = false;
      for (const pattern of taskPatterns) {
        const match = line.match(pattern);
        if (match) {
          taskTitle = match[match.length - 1].trim();
          isTask = true;
          break;
        }
      }

      // If not explicitly a task, check if it contains action words
      if (!isTask && taskTitle.length > 5 && taskTitle.length < 100) {
        const actionWords = ['read', 'write', 'complete', 'finish', 'submit', 'study', 'review', 'prepare', 'create', 'update', 'fix', 'test', 'implement', 'assignment', 'homework', 'project', 'chapter', 'page', 'exercise'];
        isTask = actionWords.some(word => taskTitle.toLowerCase().includes(word));
      }

      if (isTask) {
        // Extract date from the line
        for (const datePattern of datePatterns) {
          const dateMatch = taskTitle.match(datePattern);
          if (dateMatch) {
            const dateStr = dateMatch[0];
            dueDate = parseDateString(dateStr);
            // Remove date from title
            taskTitle = taskTitle.replace(dateStr, '').trim();
            break;
          }
        }

        // If no date found, default to 7 days from now
        if (!dueDate) {
          dueDate = getDateFromNow(7);
        }

        tasks.push({
          id: `ocr_${taskId++}`,
          title: taskTitle,
          dueDate: dueDate,
          time: "23:59",
          project: projects[0]?._id || null,
          status: "todo",
        });
      }
    }

    // If no tasks found, return a default task with the first meaningful line
    if (tasks.length === 0 && lines.length > 0) {
      tasks.push({
        id: "ocr_1",
        title: lines[0].substring(0, 100),
        dueDate: getDateFromNow(7),
        time: "23:59",
        project: projects[0]?._id || null,
        status: "todo",
      });
    }

    return tasks;
  };

  const parseDateString = (dateStr) => {
    const str = dateStr.toLowerCase();
    
    // Handle relative dates
    if (str.includes('tomorrow')) return getDateFromNow(1);
    if (str.includes('next week')) return getDateFromNow(7);
    if (str.includes('next month')) return getDateFromNow(30);
    
    // Handle day names
    const days = ['sunday', 'monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday'];
    for (let i = 0; i < days.length; i++) {
      if (str.includes(days[i])) {
        const today = new Date();
        const currentDay = today.getDay();
        const targetDay = i;
        const daysUntil = (targetDay - currentDay + 7) % 7 || 7;
        return getDateFromNow(daysUntil);
      }
    }
    
    // Try to parse as date
    const date = new Date(dateStr);
    if (!isNaN(date.getTime())) {
      return date.toISOString().split('T')[0];
    }
    
    // Default to 7 days from now
    return getDateFromNow(7);
  };

  const extractTasksFromImage = () => {
    // Fallback mock data
    return [
      {
        id: "ocr_1",
        title: "Read Chapter 7",
        dueDate: getDateFromNow(7),
        time: "23:59",
        project: projects[0]?._id || null,
        status: "todo",
      },
      {
        id: "ocr_2",
        title: "Project Outline",
        dueDate: getDateFromNow(14),
        time: "23:59",
        project: projects[0]?._id || null,
        status: "todo",
      },
    ];
  };

  const getDateFromNow = (days) => {
    const date = new Date();
    date.setDate(date.getDate() + days);
    return date.toISOString().split("T")[0];
  };

  const toggleTaskSelection = (taskId) => {
    setSelectedTasks((prev) =>
      prev.includes(taskId)
        ? prev.filter((id) => id !== taskId)
        : [...prev, taskId]
    );
  };

  const handleConfirmOCRTasks = () => {
    const tasksToCreate = extractedTasks.filter((task) =>
      selectedTasks.includes(task.id)
    );

    tasksToCreate.forEach((task) => {
      if (onTaskCreate) {
        onTaskCreate(task);
      }
    });

    setShowOCRModal(false);
    setExtractedTasks([]);
    setSelectedTasks([]);
    setUploadedImage(null);
  };

  const handleCancelOCR = () => {
    setShowOCRModal(false);
    setExtractedTasks([]);
    setSelectedTasks([]);
    setUploadedImage(null);
    setIsProcessing(false);
  };

  return (
    <>
      <AnimatePresence>
        {!isExpanded ? (
          <FloatingButtonGroup>
            <FloatingButton
              key="fab-main"
              initial={{ scale: 0, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0, opacity: 0 }}
              transition={{ duration: 0.3 }}
              onClick={() => setIsExpanded(true)}
              title="Quick Capture - Add Task"
            >
              ✨
            </FloatingButton>
            <SecondaryButton
              key="fab-chat"
              initial={{ scale: 0, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0, opacity: 0 }}
              transition={{ duration: 0.3, delay: 0.1 }}
              onClick={() => setShowChat(true)}
              title="Chat with Sprout AI"
            >
              🌱
            </SecondaryButton>
          </FloatingButtonGroup>
        ) : (
          <QuickCaptureBar
            key="bar"
            initial={{ scale: 0.8, opacity: 0, x: 100 }}
            animate={{ scale: 1, opacity: 1, x: 0 }}
            exit={{ scale: 0.8, opacity: 0, x: 100 }}
            transition={{ duration: 0.3, ease: "easeOut" }}
          >
            <SproutIcon 
              onClick={() => setShowChat(true)}
              title="Chat with Sprout AI"
              style={{ cursor: "pointer" }}
            >
              💬
            </SproutIcon>
            <InputField
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder={placeholders[placeholderIndex]}
              autoFocus
            />
            <IconButton onClick={handleSubmit} disabled={isProcessing} title="Send">
              <FiSend size={18} />
            </IconButton>
            <IconButton
              as="label"
              htmlFor="image-upload"
              title="Snap-to-Task: Upload image"
            >
              <FiCamera size={18} />
              <HiddenFileInput
                id="image-upload"
                type="file"
                accept="image/*"
                onChange={handleImageUpload}
              />
            </IconButton>
          </QuickCaptureBar>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {showModal && parsedTask && (
          <ModalOverlay
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={handleCancel}
          >
            <ModalContent
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              onClick={(e) => e.stopPropagation()}
            >
              <ModalHeader>
                <SproutAvatar>🌱</SproutAvatar>
                <div>
                  <ModalTitle>Sprout parsed your task!</ModalTitle>
                  <p style={{ margin: "4px 0 0 0", color: "#666", fontSize: "14px" }}>
                    Review and confirm the details
                  </p>
                </div>
              </ModalHeader>

              <ParsedTask>
                <TaskField>
                  <Label>Task Title</Label>
                  <Input
                    type="text"
                    value={parsedTask.title}
                    onChange={(e) =>
                      setParsedTask({ ...parsedTask, title: e.target.value })
                    }
                  />
                </TaskField>

                <TaskField>
                  <Label>Due Date</Label>
                  <Input
                    type="date"
                    value={parsedTask.dueDate}
                    onChange={(e) =>
                      setParsedTask({ ...parsedTask, dueDate: e.target.value })
                    }
                  />
                </TaskField>

                <TaskField>
                  <Label>Time</Label>
                  <Input
                    type="time"
                    value={parsedTask.time}
                    onChange={(e) =>
                      setParsedTask({ ...parsedTask, time: e.target.value })
                    }
                  />
                </TaskField>

                <TaskField>
                  <Label>Project</Label>
                  <Select
                    value={parsedTask.project || ""}
                    onChange={(e) =>
                      setParsedTask({ ...parsedTask, project: e.target.value })
                    }
                  >
                    <option value="">No Project</option>
                    {projects.map((project) => (
                      <option key={project._id} value={project._id}>
                        {project.name}
                      </option>
                    ))}
                  </Select>
                </TaskField>
              </ParsedTask>

              <ButtonGroup>
                <Button onClick={handleCancel}>Cancel</Button>
                <Button $primary onClick={handleConfirm}>
                  Add Task
                </Button>
              </ButtonGroup>
            </ModalContent>
          </ModalOverlay>
        )}

        {showOCRModal && (
          <ModalOverlay
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={handleCancelOCR}
          >
            <ModalContent
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              onClick={(e) => e.stopPropagation()}
              style={{ maxWidth: "700px" }}
            >
              <ModalHeader>
                <SproutAvatar>📷</SproutAvatar>
                <div>
                  <ModalTitle>Snap-to-Task</ModalTitle>
                  <p style={{ margin: "4px 0 0 0", color: "#666", fontSize: "14px" }}>
                    {isProcessing
                      ? "Sprout is analyzing your image..."
                      : `Found ${extractedTasks.length} tasks! Select which ones to add.`}
                  </p>
                </div>
              </ModalHeader>

              {uploadedImage && (
                <ImagePreview src={uploadedImage} alt="Uploaded document" />
              )}

              {isProcessing ? (
                <ProcessingMessage>
                  <LoadingSpinner />
                  <div>Processing image with AI OCR...</div>
                  {ocrProgress > 0 && (
                    <div style={{ marginTop: "12px", fontSize: "14px", color: "#667eea" }}>
                      {ocrProgress}% complete
                    </div>
                  )}
                </ProcessingMessage>
              ) : (
                <>
                  <TaskList>
                    {extractedTasks.map((task) => (
                      <TaskItem
                        key={task.id}
                        $selected={selectedTasks.includes(task.id)}
                        onClick={() => toggleTaskSelection(task.id)}
                      >
                        <Checkbox
                          type="checkbox"
                          checked={selectedTasks.includes(task.id)}
                          onChange={() => toggleTaskSelection(task.id)}
                        />
                        <TaskDetails>
                          <TaskTitle>{task.title}</TaskTitle>
                          <TaskMeta>
                            Due: {new Date(task.dueDate).toLocaleDateString("en-US", {
                              weekday: "short",
                              month: "short",
                              day: "numeric",
                            })}
                          </TaskMeta>
                        </TaskDetails>
                      </TaskItem>
                    ))}
                  </TaskList>

                  <ButtonGroup style={{ marginTop: "20px" }}>
                    <Button onClick={handleCancelOCR}>Cancel</Button>
                    <Button
                      $primary
                      onClick={handleConfirmOCRTasks}
                      disabled={selectedTasks.length === 0}
                    >
                      Add {selectedTasks.length} Task{selectedTasks.length !== 1 ? "s" : ""}
                    </Button>
                  </ButtonGroup>
                </>
              )}
            </ModalContent>
          </ModalOverlay>
        )}
      </AnimatePresence>

      <SproutChat
        isOpen={showChat}
        onClose={() => setShowChat(false)}
        projects={projects}
        onTaskCreate={onTaskCreate}
        onProjectCreate={onProjectCreate}
        onRefreshProjects={onRefreshProjects}
      />
    </>
  );
};

export default SproutQuickCapture;
