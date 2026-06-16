export const engineeringSkillsCategories = [
  {
    category: "Programming Languages",
    skills: ["C", "C++", "Java", "Python", "JavaScript", "TypeScript", "Go", "Rust", "R", "SQL", "Verilog", "SystemVerilog"]
  },
  {
    category: "Web Development",
    skills: ["HTML", "CSS", "React.js", "Next.js", "Angular", "Vue.js", "Node.js", "Express.js", "Spring Boot", "Django", "Flask", "REST API Development"]
  },
  {
    category: "Databases",
    skills: ["MySQL", "PostgreSQL", "MongoDB", "Redis", "Cassandra"]
  },
  {
    category: "Software Testing & QA",
    skills: ["Manual Testing", "Selenium", "Playwright", "Cypress", "Postman", "Swagger", "JMeter", "LoadRunner", "API Testing", "Performance Testing", "Automation Testing"]
  },
  {
    category: "DevOps & Cloud",
    skills: ["Linux", "Git", "GitHub", "Docker", "Kubernetes", "Jenkins", "GitHub Actions", "AWS", "Microsoft Azure", "Google Cloud Platform (GCP)", "CI/CD"]
  },
  {
    category: "AI, ML & Data Science",
    skills: ["NumPy", "Pandas", "Matplotlib", "Seaborn", "Scikit-Learn", "TensorFlow", "PyTorch", "Keras", "XGBoost", "LightGBM", "LangChain", "OpenAI API", "Gemini API", "MLflow", "Kubeflow", "Apache Airflow", "Apache Spark", "Hadoop"]
  },
  {
    category: "Data Analytics & Visualization",
    skills: ["Excel", "Power BI", "Tableau", "SPSS"]
  },
  {
    category: "Cyber Security",
    skills: ["Kali Linux", "Wireshark", "Nmap", "Burp Suite", "Metasploit", "Nessus", "Splunk", "QRadar", "CrowdStrike", "Ethical Hacking", "Penetration Testing", "Digital Forensics", "Network Security", "Cloud Security"]
  },
  {
    category: "Embedded Systems & IoT",
    skills: ["Arduino", "ESP32", "STM32", "Raspberry Pi", "IoT Development"]
  },
  {
    category: "Electronics Design Tools",
    skills: ["Proteus", "Multisim", "LTSpice", "Cadence", "Synopsys", "Xilinx Vivado"]
  },
  {
    category: "Electrical Engineering Tools",
    skills: ["MATLAB", "Simulink", "ETAP", "PSCAD", "PLC Programming", "SCADA", "Siemens TIA Portal", "Wonderware", "Smart Grid Systems", "EV Systems", "Solar Design"]
  },
  {
    category: "Mechanical CAD Tools",
    skills: ["AutoCAD Mechanical", "SolidWorks", "CATIA", "Creo", "Fusion 360", "NX CAD"]
  },
  {
    category: "Mechanical CAE Tools",
    skills: ["ANSYS", "Abaqus", "HyperMesh", "ANSYS Fluent", "CFD Analysis"]
  },
  {
    category: "CAM & Manufacturing",
    skills: ["Mastercam", "Edgecam", "PowerMill", "CNC Programming", "GD&T"]
  },
  {
    category: "Civil Engineering Tools",
    skills: ["AutoCAD", "Civil 3D", "Revit", "BIM 360", "STAAD Pro", "ETABS", "SAP2000", "Primavera P6", "MS Project", "Total Station", "ArcGIS", "QGIS", "GIS", "Drone Surveying"]
  },
  {
    category: "Chemical Engineering Tools",
    skills: ["Aspen Plus", "Aspen HYSYS", "COMSOL", "Process Control", "Industrial Automation"]
  },
  {
    category: "Robotics",
    skills: ["ROS", "ROS2", "Gazebo", "OpenCV", "Computer Vision", "Digital Twin"]
  },
  {
    category: "Aerospace Engineering",
    skills: ["CFD", "Aerodynamic Analysis", "Flight Simulation"]
  },
  {
    category: "Biotechnology & Bioinformatics",
    skills: ["BLAST", "Geneious", "Bioinformatics"]
  },
  {
    category: "Project Management & Collaboration",
    skills: ["Jira", "Trello", "Notion", "Microsoft Project", "Primavera", "Agile", "Scrum"]
  },
  {
    category: "Design & UI/UX",
    skills: ["Figma", "Canva", "UI Design", "UX Design", "Wireframing", "Prototyping"]
  },
  {
    category: "Core Computer Science Skills",
    skills: ["Data Structures", "Algorithms", "DBMS", "Operating Systems", "Computer Networks", "Object Oriented Programming (OOP)", "System Design"]
  },
  {
    category: "Communication & Productivity",
    skills: ["Microsoft Office", "Google Workspace", "Technical Documentation", "Presentation Skills", "Team Collaboration", "Problem Solving", "Analytical Thinking"]
  }
];

export const allSkillsFlat = engineeringSkillsCategories.reduce((acc, cat) => [...acc, ...cat.skills], []);
