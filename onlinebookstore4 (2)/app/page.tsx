"use client"

import type React from "react"
import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import {
  GraduationCap,
  Mail,
  Lock,
  BookOpen,
  FileText,
  Search,
  Download,
  Users,
  Star,
  ArrowRight,
  Settings,
  Plus,
  Edit,
  Trash2,
  Upload,
  BarChart3,
  Shield,
  UserCheck,
  Building2,
  Calendar,
} from "lucide-react"
import { AuthDialog } from "@/components/auth-dialog"
import { createClient } from "@/lib/supabase-client"

// Mock user types
type UserRole = "student" | "admin"

interface MockUser {
  id: string
  name: string
  email: string
  role: UserRole
  department?: string
  semester?: number
  joinDate?: string
  status?: "active" | "inactive"
}

interface StudyMaterial {
  id: string
  title: string
  type: "note" | "question-paper"
  department: string
  semester: number
  subject: string
  uploadDate: string
  downloads: number
  rating: number
  fileSize: string
  uploadedBy?: string
  status?: "active" | "pending" | "rejected"
}

interface Department {
  id: string
  name: string
  code: string
  description: string
  totalSemesters: number
  subjects: string[]
  headOfDepartment?: string
  establishedYear: number
  status: "active" | "inactive"
  studentCount: number
  materialCount: number
}

const mockMaterials: StudyMaterial[] = [
  {
    id: "1",
    title: "Data Structures and Algorithms - Complete Notes",
    type: "note",
    department: "Computer Science",
    semester: 3,
    subject: "Data Structures",
    uploadDate: "2024-01-15",
    downloads: 245,
    rating: 4.8,
    fileSize: "2.4 MB",
    uploadedBy: "Dr. Smith",
    status: "active",
  },
  {
    id: "2",
    title: "Database Management Systems - Mid Term Paper 2023",
    type: "question-paper",
    department: "Computer Science",
    semester: 4,
    subject: "DBMS",
    uploadDate: "2024-01-10",
    downloads: 189,
    rating: 4.6,
    fileSize: "1.2 MB",
    uploadedBy: "Admin User",
    status: "active",
  },
  {
    id: "3",
    title: "Operating Systems - Unit 1-3 Summary",
    type: "note",
    department: "Computer Science",
    semester: 4,
    subject: "Operating Systems",
    uploadDate: "2024-01-08",
    downloads: 156,
    rating: 4.7,
    fileSize: "1.8 MB",
    uploadedBy: "Dr. Johnson",
    status: "pending",
  },
  {
    id: "4",
    title: "Computer Networks - Previous Year Questions",
    type: "question-paper",
    department: "Computer Science",
    semester: 5,
    subject: "Computer Networks",
    uploadDate: "2024-01-05",
    downloads: 203,
    rating: 4.5,
    fileSize: "0.9 MB",
    uploadedBy: "Admin User",
    status: "active",
  },
]

const mockUsers: MockUser[] = [
  {
    id: "1",
    name: "John Doe",
    email: "john.doe@student.edu",
    role: "student",
    department: "Computer Science",
    semester: 4,
    joinDate: "2023-08-15",
    status: "active",
  },
  {
    id: "2",
    name: "Jane Smith",
    email: "jane.smith@student.edu",
    role: "student",
    department: "Mathematics",
    semester: 2,
    joinDate: "2024-01-10",
    status: "active",
  },
  {
    id: "3",
    name: "Dr. Admin",
    email: "admin@university.edu",
    role: "admin",
    joinDate: "2022-01-01",
    status: "active",
  },
  {
    id: "4",
    name: "Sarah Wilson",
    email: "sarah.wilson@student.edu",
    role: "student",
    department: "Physics",
    semester: 3,
    joinDate: "2023-08-15",
    status: "inactive",
  },
]

const mockDepartments: Department[] = [
  {
    id: "1",
    name: "Tamil",
    code: "TAM",
    description: "Department of Tamil Language and Literature",
    totalSemesters: 6,
    subjects: ["Tamil Literature", "Grammar", "Poetry", "Prose"],
    headOfDepartment: "Dr. Ravi Kumar",
    establishedYear: 1985,
    status: "active",
    studentCount: 45,
    materialCount: 12,
  },
  {
    id: "2",
    name: "English",
    code: "ENG",
    description: "Department of English Language and Literature",
    totalSemesters: 6,
    subjects: ["English Literature", "Grammar", "Communication Skills", "Creative Writing"],
    headOfDepartment: "Dr. Sarah Johnson",
    establishedYear: 1980,
    status: "active",
    studentCount: 78,
    materialCount: 24,
  },
  {
    id: "3",
    name: "Mathematics",
    code: "MATH",
    description: "Department of Mathematics and Applied Mathematics",
    totalSemesters: 8,
    subjects: ["Calculus", "Algebra", "Statistics", "Discrete Mathematics", "Numerical Methods"],
    headOfDepartment: "Dr. Priya Sharma",
    establishedYear: 1975,
    status: "active",
    studentCount: 92,
    materialCount: 35,
  },
  {
    id: "4",
    name: "Physics",
    code: "PHY",
    description: "Department of Physics and Applied Physics",
    totalSemesters: 8,
    subjects: ["Mechanics", "Thermodynamics", "Electromagnetism", "Quantum Physics", "Optics"],
    headOfDepartment: "Dr. Rajesh Gupta",
    establishedYear: 1978,
    status: "active",
    studentCount: 67,
    materialCount: 28,
  },
  {
    id: "5",
    name: "Chemistry",
    code: "CHEM",
    description: "Department of Chemistry and Biochemistry",
    totalSemesters: 8,
    subjects: ["Organic Chemistry", "Inorganic Chemistry", "Physical Chemistry", "Analytical Chemistry"],
    headOfDepartment: "Dr. Meera Patel",
    establishedYear: 1982,
    status: "active",
    studentCount: 54,
    materialCount: 22,
  },
  {
    id: "6",
    name: "Botany",
    code: "BOT",
    description: "Department of Botany and Plant Sciences",
    totalSemesters: 6,
    subjects: ["Plant Biology", "Ecology", "Genetics", "Plant Pathology"],
    headOfDepartment: "Dr. Anita Singh",
    establishedYear: 1988,
    status: "active",
    studentCount: 38,
    materialCount: 18,
  },
  {
    id: "7",
    name: "Zoology",
    code: "ZOO",
    description: "Department of Zoology and Animal Sciences",
    totalSemesters: 6,
    subjects: ["Animal Biology", "Physiology", "Evolution", "Animal Behavior"],
    headOfDepartment: "Dr. Vikram Reddy",
    establishedYear: 1990,
    status: "active",
    studentCount: 42,
    materialCount: 16,
  },
  {
    id: "8",
    name: "Computer Science",
    code: "CS",
    description: "Department of Computer Science and Engineering",
    totalSemesters: 8,
    subjects: [
      "Programming",
      "Data Structures",
      "Algorithms",
      "Database Systems",
      "Computer Networks",
      "Operating Systems",
    ],
    headOfDepartment: "Dr. Amit Kumar",
    establishedYear: 1995,
    status: "active",
    studentCount: 156,
    materialCount: 48,
  },
  {
    id: "9",
    name: "Political Science",
    code: "POLS",
    description: "Department of Political Science and Public Policy",
    totalSemesters: 6,
    subjects: ["Political Theory", "Comparative Politics", "International Relations", "Public Administration"],
    headOfDepartment: "Dr. Sunita Agarwal",
    establishedYear: 1983,
    status: "active",
    studentCount: 63,
    materialCount: 20,
  },
  {
    id: "10",
    name: "Public Administration",
    code: "PA",
    description: "Department of Public Administration and Governance",
    totalSemesters: 6,
    subjects: ["Administrative Theory", "Public Policy", "Governance", "Development Administration"],
    headOfDepartment: "Dr. Ramesh Chandra",
    establishedYear: 1992,
    status: "active",
    studentCount: 48,
    materialCount: 15,
  },
  {
    id: "11",
    name: "History",
    code: "HIST",
    description: "Department of History and Archaeology",
    totalSemesters: 6,
    subjects: ["Ancient History", "Medieval History", "Modern History", "Archaeology"],
    headOfDepartment: "Dr. Kavita Joshi",
    establishedYear: 1979,
    status: "active",
    studentCount: 52,
    materialCount: 19,
  },
  {
    id: "12",
    name: "Economics",
    code: "ECON",
    description: "Department of Economics and Applied Economics",
    totalSemesters: 6,
    subjects: ["Microeconomics", "Macroeconomics", "Econometrics", "Development Economics"],
    headOfDepartment: "Dr. Suresh Nair",
    establishedYear: 1981,
    status: "active",
    studentCount: 74,
    materialCount: 26,
  },
  {
    id: "13",
    name: "Commerce",
    code: "COM",
    description: "Department of Commerce and Business Studies",
    totalSemesters: 6,
    subjects: ["Accounting", "Business Management", "Marketing", "Finance", "Business Law"],
    headOfDepartment: "Dr. Neha Gupta",
    establishedYear: 1987,
    status: "active",
    studentCount: 98,
    materialCount: 32,
  },
  {
    id: "14",
    name: "Nutrition",
    code: "NUT",
    description: "Department of Nutrition and Dietetics",
    totalSemesters: 6,
    subjects: ["Human Nutrition", "Food Science", "Dietetics", "Community Nutrition"],
    headOfDepartment: "Dr. Pooja Verma",
    establishedYear: 2000,
    status: "active",
    studentCount: 36,
    materialCount: 14,
  },
]

export default function StudyHub() {
  const [isLoggedIn, setIsLoggedIn] = useState(false)
  const [currentUser, setCurrentUser] = useState<MockUser | null>(null)
  const [loginData, setLoginData] = useState({ email: "", password: "" })
  const [registerData, setRegisterData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
    department: "",
    role: "student" as UserRole,
  })
  const [activeView, setActiveView] = useState<
    | "dashboard"
    | "departments"
    | "materials"
    | "search"
    | "admin-users"
    | "admin-content"
    | "admin-analytics"
    | "admin-departments"
    | "uploaded-notes" // Added new view for uploaded notes
  >("dashboard")
  const [selectedDepartment, setSelectedDepartment] = useState<string | null>(null)
  const [searchQuery, setSearchQuery] = useState("")
  const [isUploadDialogOpen, setIsUploadDialogOpen] = useState(false)
  const [isDepartmentDialogOpen, setIsDepartmentDialogOpen] = useState(false)
  const [uploadData, setUploadData] = useState({
    title: "",
    type: "note" as "note" | "question-paper",
    department: "",
    semester: 1,
    subject: "",
    description: "",
  })
  const [uploadedNotes, setUploadedNotes] = useState<any[]>([])
  const [isUploading, setIsUploading] = useState(false)
  const [selectedFile, setSelectedFile] = useState<File | null>(null)
  const [departmentData, setDepartmentData] = useState({
    name: "",
    code: "",
    description: "",
    totalSemesters: 6,
    subjects: "",
    headOfDepartment: "",
    establishedYear: new Date().getFullYear(),
  })
  const [user, setUser] = useState<any>(null)
  const [isAuthDialogOpen, setIsAuthDialogOpen] = useState(false)

  const supabase = createClient()

  useEffect(() => {
    const getUser = async () => {
      const {
        data: { user },
      } = await supabase.auth.getUser()
      setUser(user)
    }
    getUser()

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((event, session) => {
      setUser(session?.user ?? null)
    })

    return () => subscription.unsubscribe()
  }, [])

  const departments = mockDepartments.map((dept) => dept.name)

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault()
    if (loginData.email && loginData.password) {
      const isAdmin = loginData.email.includes("admin")
      const mockUser: MockUser = {
        id: "1",
        name: isAdmin ? "Admin User" : "Student User",
        email: loginData.email,
        role: isAdmin ? "admin" : "student",
        department: isAdmin ? undefined : "Computer Science",
        semester: isAdmin ? undefined : 4,
      }
      setCurrentUser(mockUser)
      setIsLoggedIn(true)
    }
  }

  const handleRegister = (e: React.FormEvent) => {
    e.preventDefault()
    if (
      registerData.name &&
      registerData.email &&
      registerData.password &&
      registerData.password === registerData.confirmPassword
    ) {
      const mockUser: MockUser = {
        id: "2",
        name: registerData.name,
        email: registerData.email,
        role: registerData.role,
        department: registerData.role === "student" ? registerData.department : undefined,
        semester: registerData.role === "student" ? 1 : undefined,
      }
      setCurrentUser(mockUser)
      setIsLoggedIn(true)
    }
  }

  const handleLogout = () => {
    setIsLoggedIn(false)
    setCurrentUser(null)
    setLoginData({ email: "", password: "" })
    setRegisterData({ name: "", email: "", password: "", confirmPassword: "", department: "", role: "student" })
    setActiveView("dashboard")
    setSelectedDepartment(null)
  }

  const handleSignOut = async () => {
    await supabase.auth.signOut()
    setUser(null)
  }

  const handleUploadMaterial = async (e?: React.FormEvent) => {
    if (!user) {
      setIsAuthDialogOpen(true)
      if (e) e.preventDefault()
      return
    }

    if (!selectedFile) {
      alert("Please select a file to upload")
      return
    }

    setIsUploading(true)
    try {
      const formData = new FormData()
      formData.append("file", selectedFile)
      formData.append("title", uploadData.title)
      formData.append("folder", `${uploadData.department}/${uploadData.subject}`)

      const response = await fetch("/api/notes/upload", {
        method: "POST",
        body: formData,
      })

      const result = await response.json()

      if (response.ok) {
        console.log("Upload successful:", result)
        setIsUploadDialogOpen(false)
        setUploadData({
          title: "",
          type: "note",
          department: "",
          semester: 1,
          subject: "",
          description: "",
        })
        setSelectedFile(null)
        // Refresh uploaded notes list
        fetchUploadedNotes()
        alert("File uploaded successfully!")
      } else {
        console.error("Upload failed:", result)
        alert(`Upload failed: ${result.error}`)
      }
    } catch (error) {
      console.error("Upload error:", error)
      alert("Upload failed. Please try again.")
    } finally {
      setIsUploading(false)
    }
  }

  const fetchUploadedNotes = async () => {
    try {
      const response = await fetch("/api/notes/list")
      if (response.ok) {
        const result = await response.json()
        setUploadedNotes(result.notes || [])
      }
    } catch (error) {
      console.error("Failed to fetch notes:", error)
    }
  }

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    setSelectedFile(file || null)
  }

  const handleCreateDepartment = (e: React.FormEvent) => {
    e.preventDefault()
    console.log("Creating department:", departmentData)
    setIsDepartmentDialogOpen(false)
    setDepartmentData({
      name: "",
      code: "",
      description: "",
      totalSemesters: 6,
      subjects: "",
      headOfDepartment: "",
      establishedYear: new Date().getFullYear(),
    })
  }

  const getFilteredMaterials = () => {
    let filtered = mockMaterials

    if (currentUser?.role === "student" && currentUser.department) {
      filtered = filtered.filter((material) => material.department === currentUser.department)
    }

    if (selectedDepartment) {
      filtered = filtered.filter((material) => material.department === selectedDepartment)
    }

    if (searchQuery) {
      filtered = filtered.filter(
        (material) =>
          material.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
          material.subject.toLowerCase().includes(searchQuery.toLowerCase()),
      )
    }

    return filtered
  }

  const getRecentMaterials = (type?: "note" | "question-paper") => {
    let materials = getFilteredMaterials()
    if (type) {
      materials = materials.filter((material) => material.type === type)
    }
    return materials.slice(0, 3)
  }

  // Authentication Page
  if (!isLoggedIn) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-background via-card to-background flex items-center justify-center p-4">
        <Card className="w-full max-w-md">
          <CardHeader className="text-center">
            <div className="flex justify-center mb-4">
              <GraduationCap className="h-12 w-12 text-primary" />
            </div>
            <CardTitle className="text-3xl font-serif font-bold">StudyHub</CardTitle>
            <CardDescription className="text-base">
              Your comprehensive study notes and question papers management system
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Tabs defaultValue="login" className="w-full">
              <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="login">Login</TabsTrigger>
                <TabsTrigger value="register">Register</TabsTrigger>
              </TabsList>

              <TabsContent value="login">
                <form onSubmit={handleLogin} className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="login-email">Email</Label>
                    <div className="relative">
                      <Mail className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                      <Input
                        id="login-email"
                        type="email"
                        placeholder="Enter your email"
                        className="pl-10"
                        value={loginData.email}
                        onChange={(e) => setLoginData({ ...loginData, email: e.target.value })}
                        required
                      />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="login-password">Password</Label>
                    <div className="relative">
                      <Lock className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                      <Input
                        id="login-password"
                        type="password"
                        placeholder="Enter your password"
                        className="pl-10"
                        value={loginData.password}
                        onChange={(e) => setLoginData({ ...loginData, password: e.target.value })}
                        required
                      />
                    </div>
                  </div>
                  <Button type="submit" className="w-full">
                    Sign In
                  </Button>
                </form>
                <div className="mt-4 text-center text-sm text-muted-foreground">
                  Demo: Use any email (include 'admin' for admin access) and password
                </div>
              </TabsContent>

              <TabsContent value="register">
                <form onSubmit={handleRegister} className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="register-name">Full Name</Label>
                    <div className="relative">
                      <GraduationCap className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                      <Input
                        id="register-name"
                        type="text"
                        placeholder="Enter your full name"
                        className="pl-10"
                        value={registerData.name}
                        onChange={(e) => setRegisterData({ ...registerData, name: e.target.value })}
                        required
                      />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="register-email">Email</Label>
                    <div className="relative">
                      <Mail className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                      <Input
                        id="register-email"
                        type="email"
                        placeholder="Enter your email"
                        className="pl-10"
                        value={registerData.email}
                        onChange={(e) => setRegisterData({ ...registerData, email: e.target.value })}
                        required
                      />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="register-role">Role</Label>
                    <select
                      id="register-role"
                      className="w-full px-3 py-2 border border-border rounded-md bg-input"
                      value={registerData.role}
                      onChange={(e) => setRegisterData({ ...registerData, role: e.target.value as UserRole })}
                    >
                      <option value="student">Student</option>
                      <option value="admin">Admin</option>
                    </select>
                  </div>
                  {registerData.role === "student" && (
                    <div className="space-y-2">
                      <Label htmlFor="register-department">Department</Label>
                      <select
                        id="register-department"
                        className="w-full px-3 py-2 border border-border rounded-md bg-input"
                        value={registerData.department}
                        onChange={(e) => setRegisterData({ ...registerData, department: e.target.value })}
                        required
                      >
                        <option value="">Select Department</option>
                        {departments.map((dept) => (
                          <option key={dept} value={dept}>
                            {dept}
                          </option>
                        ))}
                      </select>
                    </div>
                  )}
                  <div className="space-y-2">
                    <Label htmlFor="register-password">Password</Label>
                    <div className="relative">
                      <Lock className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                      <Input
                        id="register-password"
                        type="password"
                        placeholder="Enter your password"
                        className="pl-10"
                        value={registerData.password}
                        onChange={(e) => setRegisterData({ ...registerData, password: e.target.value })}
                        required
                      />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="register-confirm-password">Confirm Password</Label>
                    <div className="relative">
                      <Lock className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                      <Input
                        id="register-confirm-password"
                        type="password"
                        placeholder="Confirm your password"
                        className="pl-10"
                        value={registerData.confirmPassword}
                        onChange={(e) => setRegisterData({ ...registerData, confirmPassword: e.target.value })}
                        required
                      />
                    </div>
                  </div>
                  <Button type="submit" className="w-full">
                    Register
                  </Button>
                </form>
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-4">
              <BookOpen className="h-8 w-8 text-blue-600" />
              <h1 className="text-2xl font-bold text-gray-900">StudyHub</h1>
            </div>
            <div className="flex items-center space-x-4">
              {user ? (
                <div className="flex items-center space-x-2">
                  <span className="text-sm text-gray-600">Welcome, {user.email}</span>
                  <Button variant="outline" size="sm" onClick={handleSignOut}>
                    Sign Out
                  </Button>
                </div>
              ) : (
                <Button onClick={() => setIsAuthDialogOpen(true)}>Sign In</Button>
              )}
            </div>
          </div>
        </div>
      </header>

      {/* Navigation */}
      <nav className="border-b bg-muted/30">
        <div className="container mx-auto px-4">
          <div className="flex gap-6">
            <Button
              variant={activeView === "dashboard" ? "default" : "ghost"}
              size="sm"
              onClick={() => setActiveView("dashboard")}
              className="rounded-none border-b-2 border-transparent data-[state=active]:border-primary"
            >
              Dashboard
            </Button>
            <Button
              variant={activeView === "departments" ? "default" : "ghost"}
              size="sm"
              onClick={() => setActiveView("departments")}
              className="rounded-none border-b-2 border-transparent data-[state=active]:border-primary"
            >
              Departments
            </Button>
            <Button
              variant={activeView === "materials" ? "default" : "ghost"}
              size="sm"
              onClick={() => setActiveView("materials")}
              className="rounded-none border-b-2 border-transparent data-[state=active]:border-primary"
            >
              All Materials
            </Button>
            <Button
              variant={activeView === "search" ? "default" : "ghost"}
              size="sm"
              onClick={() => setActiveView("search")}
              className="rounded-none border-b-2 border-transparent data-[state=active]:border-primary"
            >
              Search
            </Button>
            {currentUser?.role === "admin" && (
              <>
                <Button
                  variant={activeView === "admin-users" ? "default" : "ghost"}
                  size="sm"
                  onClick={() => setActiveView("admin-users")}
                  className="rounded-none border-b-2 border-transparent data-[state=active]:border-primary"
                >
                  <Users className="h-4 w-4 mr-2" />
                  Users
                </Button>
                <Button
                  variant={activeView === "admin-content" ? "default" : "ghost"}
                  size="sm"
                  onClick={() => setActiveView("admin-content")}
                  className="rounded-none border-b-2 border-transparent data-[state=active]:border-primary"
                >
                  <Settings className="h-4 w-4 mr-2" />
                  Content
                </Button>
                <Button
                  variant={activeView === "uploaded-notes" ? "default" : "ghost"}
                  size="sm"
                  onClick={() => {
                    setActiveView("uploaded-notes")
                    fetchUploadedNotes()
                  }}
                  className="rounded-none border-b-2 border-transparent data-[state=active]:border-primary"
                >
                  <FileText className="h-4 w-4 mr-2" />
                  Uploaded Notes
                </Button>
                <Button
                  variant={activeView === "admin-departments" ? "default" : "ghost"}
                  size="sm"
                  onClick={() => setActiveView("admin-departments")}
                  className="rounded-none border-b-2 border-transparent data-[state=active]:border-primary"
                >
                  <Building2 className="h-4 w-4 mr-2" />
                  Departments
                </Button>
                <Button
                  variant={activeView === "admin-analytics" ? "default" : "ghost"}
                  size="sm"
                  onClick={() => setActiveView("admin-analytics")}
                  className="rounded-none border-b-2 border-transparent data-[state=active]:border-primary"
                >
                  <BarChart3 className="h-4 w-4 mr-2" />
                  Analytics
                </Button>
              </>
            )}
          </div>
        </div>
      </nav>

      <div className="container mx-auto px-4 py-8">
        {/* Dashboard View */}
        {activeView === "dashboard" && (
          <>
            <div className="text-center mb-12">
              <h2 className="text-4xl font-serif font-bold mb-4">
                {currentUser?.role === "admin" ? "Admin Dashboard" : "Student Dashboard"}
              </h2>
              <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
                {currentUser?.role === "admin"
                  ? "Manage study materials across all departments and semesters"
                  : `Access study notes and question papers for ${currentUser?.department || "your department"}`}
              </p>
            </div>

            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-muted-foreground">Total Notes</p>
                      <p className="text-2xl font-bold">
                        {getFilteredMaterials().filter((m) => m.type === "note").length}
                      </p>
                    </div>
                    <BookOpen className="h-8 w-8 text-primary" />
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-muted-foreground">Question Papers</p>
                      <p className="text-2xl font-bold">
                        {getFilteredMaterials().filter((m) => m.type === "question-paper").length}
                      </p>
                    </div>
                    <FileText className="h-8 w-8 text-secondary" />
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-muted-foreground">Total Downloads</p>
                      <p className="text-2xl font-bold">
                        {getFilteredMaterials().reduce((sum, m) => sum + m.downloads, 0)}
                      </p>
                    </div>
                    <Download className="h-8 w-8 text-primary" />
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-muted-foreground">
                        {currentUser?.role === "admin" ? "Total Users" : "Departments"}
                      </p>
                      <p className="text-2xl font-bold">
                        {currentUser?.role === "admin" ? mockUsers.length : departments.length}
                      </p>
                    </div>
                    <Users className="h-8 w-8 text-secondary" />
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Recent Materials */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <BookOpen className="h-5 w-5" />
                    Recent Notes
                  </CardTitle>
                  <CardDescription>Latest study materials uploaded</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  {getRecentMaterials("note").map((material) => (
                    <div key={material.id} className="flex items-center justify-between p-3 border rounded-lg">
                      <div className="flex-1">
                        <h4 className="font-medium text-sm">{material.title}</h4>
                        <p className="text-xs text-muted-foreground">
                          {material.subject} • Semester {material.semester} • {material.fileSize}
                        </p>
                        <div className="flex items-center gap-2 mt-1">
                          <Badge variant="secondary" className="text-xs">
                            {material.downloads} downloads
                          </Badge>
                          <div className="flex items-center gap-1">
                            <Star className="h-3 w-3 fill-yellow-400 text-yellow-400" />
                            <span className="text-xs">{material.rating}</span>
                          </div>
                        </div>
                      </div>
                      <Button size="sm" variant="outline">
                        <Download className="h-4 w-4" />
                      </Button>
                    </div>
                  ))}
                  {getRecentMaterials("note").length === 0 && (
                    <p className="text-muted-foreground text-center py-4">No recent notes available</p>
                  )}
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <FileText className="h-5 w-5" />
                    Recent Question Papers
                  </CardTitle>
                  <CardDescription>Latest question papers uploaded</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  {getRecentMaterials("question-paper").map((material) => (
                    <div key={material.id} className="flex items-center justify-between p-3 border rounded-lg">
                      <div className="flex-1">
                        <h4 className="font-medium text-sm">{material.title}</h4>
                        <p className="text-xs text-muted-foreground">
                          {material.subject} • Semester {material.semester} • {material.fileSize}
                        </p>
                        <div className="flex items-center gap-2 mt-1">
                          <Badge variant="secondary" className="text-xs">
                            {material.downloads} downloads
                          </Badge>
                          <div className="flex items-center gap-1">
                            <Star className="h-3 w-3 fill-yellow-400 text-yellow-400" />
                            <span className="text-xs">{material.rating}</span>
                          </div>
                        </div>
                      </div>
                      <Button size="sm" variant="outline">
                        <Download className="h-4 w-4" />
                      </Button>
                    </div>
                  ))}
                  {getRecentMaterials("question-paper").length === 0 && (
                    <p className="text-muted-foreground text-center py-4">No recent question papers available</p>
                  )}
                </CardContent>
              </Card>
            </div>
          </>
        )}

        {/* Departments View */}
        {activeView === "departments" && (
          <>
            <div className="text-center mb-12">
              <h2 className="text-4xl font-serif font-bold mb-4">Browse by Department</h2>
              <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
                Select a department to view available study materials and question papers
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {mockDepartments
                .filter((dept) => dept.status === "active")
                .map((dept) => {
                  const deptMaterials = mockMaterials.filter((m) => m.department === dept.name)
                  const notesCount = deptMaterials.filter((m) => m.type === "note").length
                  const papersCount = deptMaterials.filter((m) => m.type === "question-paper").length

                  return (
                    <Card
                      key={dept.id}
                      className="cursor-pointer hover:shadow-lg transition-shadow duration-300"
                      onClick={() => {
                        setSelectedDepartment(dept.name)
                        setActiveView("materials")
                      }}
                    >
                      <CardHeader className="text-center">
                        <GraduationCap className="h-12 w-12 text-primary mx-auto mb-4" />
                        <CardTitle className="text-lg">{dept.name}</CardTitle>
                        <Badge variant="secondary" className="mb-2">
                          {dept.code}
                        </Badge>
                        <CardDescription className="text-sm">
                          {dept.studentCount} students • {dept.totalSemesters} semesters
                        </CardDescription>
                        <CardDescription>
                          {notesCount} notes • {papersCount} papers
                        </CardDescription>
                      </CardHeader>
                      <CardContent>
                        <div className="text-xs text-muted-foreground mb-3">Head: {dept.headOfDepartment}</div>
                        <Button className="w-full bg-transparent" variant="outline">
                          Browse Materials
                          <ArrowRight className="h-4 w-4 ml-2" />
                        </Button>
                      </CardContent>
                    </Card>
                  )
                })}
            </div>
          </>
        )}

        {/* Materials View */}
        {activeView === "materials" && (
          <>
            <div className="flex items-center justify-between mb-8">
              <div>
                <h2 className="text-3xl font-serif font-bold">
                  {selectedDepartment ? `${selectedDepartment} Materials` : "All Study Materials"}
                </h2>
                <p className="text-muted-foreground">{getFilteredMaterials().length} materials available</p>
              </div>
              {selectedDepartment && (
                <Button
                  variant="outline"
                  onClick={() => {
                    setSelectedDepartment(null)
                    setActiveView("departments")
                  }}
                >
                  ← Back to Departments
                </Button>
              )}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {getFilteredMaterials().map((material) => (
                <Card key={material.id} className="hover:shadow-lg transition-shadow duration-300">
                  <CardHeader>
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <Badge variant={material.type === "note" ? "default" : "secondary"} className="mb-2">
                          {material.type === "note" ? "Study Note" : "Question Paper"}
                        </Badge>
                        <CardTitle className="text-lg leading-tight">{material.title}</CardTitle>
                      </div>
                      {material.type === "note" ? (
                        <BookOpen className="h-5 w-5 text-primary" />
                      ) : (
                        <FileText className="h-5 w-5 text-secondary" />
                      )}
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      <div className="text-sm text-muted-foreground">
                        <p>
                          {material.department} • Semester {material.semester}
                        </p>
                        <p>
                          {material.subject} • {material.fileSize}
                        </p>
                      </div>

                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-4">
                          <div className="flex items-center gap-1">
                            <Download className="h-4 w-4" />
                            <span className="text-sm">{material.downloads}</span>
                          </div>
                          <div className="flex items-center gap-1">
                            <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                            <span className="text-sm">{material.rating}</span>
                          </div>
                        </div>
                        <Button size="sm">Download</Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>

            {getFilteredMaterials().length === 0 && (
              <div className="text-center py-12">
                <FileText className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                <h3 className="text-lg font-medium mb-2">No materials found</h3>
                <p className="text-muted-foreground">
                  {selectedDepartment
                    ? `No materials available for ${selectedDepartment} department yet.`
                    : "No materials match your current filters."}
                </p>
              </div>
            )}
          </>
        )}

        {/* Search View */}
        {activeView === "search" && (
          <>
            <div className="text-center mb-12">
              <h2 className="text-4xl font-serif font-bold mb-4">Search Materials</h2>
              <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
                Find specific study notes and question papers across all departments
              </p>
            </div>

            <div className="max-w-2xl mx-auto mb-8">
              <div className="relative">
                <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search for notes, subjects, or topics..."
                  className="pl-10 text-lg py-6"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
            </div>

            {searchQuery && (
              <div className="mb-6">
                <p className="text-muted-foreground">
                  {getFilteredMaterials().length} results for "{searchQuery}"
                </p>
              </div>
            )}

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {getFilteredMaterials().map((material) => (
                <Card key={material.id} className="hover:shadow-lg transition-shadow duration-300">
                  <CardHeader>
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <Badge variant={material.type === "note" ? "default" : "secondary"} className="mb-2">
                          {material.type === "note" ? "Study Note" : "Question Paper"}
                        </Badge>
                        <CardTitle className="text-lg leading-tight">{material.title}</CardTitle>
                      </div>
                      {material.type === "note" ? (
                        <BookOpen className="h-5 w-5 text-primary" />
                      ) : (
                        <FileText className="h-5 w-5 text-secondary" />
                      )}
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      <div className="text-sm text-muted-foreground">
                        <p>
                          {material.department} • Semester {material.semester}
                        </p>
                        <p>
                          {material.subject} • {material.fileSize}
                        </p>
                      </div>

                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-4">
                          <div className="flex items-center gap-1">
                            <Download className="h-4 w-4" />
                            <span className="text-sm">{material.downloads}</span>
                          </div>
                          <div className="flex items-center gap-1">
                            <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                            <span className="text-sm">{material.rating}</span>
                          </div>
                        </div>
                        <Button size="sm">Download</Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>

            {!searchQuery && (
              <div className="text-center py-12">
                <Search className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                <h3 className="text-lg font-medium mb-2">Start searching</h3>
                <p className="text-muted-foreground">Enter keywords to find study materials across all departments</p>
              </div>
            )}

            {searchQuery && getFilteredMaterials().length === 0 && (
              <div className="text-center py-12">
                <Search className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                <h3 className="text-lg font-medium mb-2">No results found</h3>
                <p className="text-muted-foreground">Try different keywords or browse by department instead</p>
              </div>
            )}
          </>
        )}

        {activeView === "admin-users" && currentUser?.role === "admin" && (
          <>
            <div className="flex items-center justify-between mb-8">
              <div>
                <h2 className="text-3xl font-serif font-bold">User Management</h2>
                <p className="text-muted-foreground">Manage students and administrators</p>
              </div>
              <Button>
                <Plus className="h-4 w-4 mr-2" />
                Add User
              </Button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-muted-foreground">Total Users</p>
                      <p className="text-2xl font-bold">{mockUsers.length}</p>
                    </div>
                    <Users className="h-8 w-8 text-primary" />
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-muted-foreground">Students</p>
                      <p className="text-2xl font-bold">{mockUsers.filter((u) => u.role === "student").length}</p>
                    </div>
                    <GraduationCap className="h-8 w-8 text-secondary" />
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-muted-foreground">Admins</p>
                      <p className="text-2xl font-bold">{mockUsers.filter((u) => u.role === "admin").length}</p>
                    </div>
                    <Shield className="h-8 w-8 text-primary" />
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-muted-foreground">Active Users</p>
                      <p className="text-2xl font-bold">{mockUsers.filter((u) => u.status === "active").length}</p>
                    </div>
                    <UserCheck className="h-8 w-8 text-secondary" />
                  </div>
                </CardContent>
              </Card>
            </div>

            <Card>
              <CardHeader>
                <CardTitle>All Users</CardTitle>
                <CardDescription>Manage user accounts and permissions</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {mockUsers.map((user) => (
                    <div key={user.id} className="flex items-center justify-between p-4 border rounded-lg">
                      <div className="flex-1">
                        <div className="flex items-center gap-3">
                          <div>
                            <h4 className="font-medium">{user.name}</h4>
                            <p className="text-sm text-muted-foreground">{user.email}</p>
                          </div>
                          <Badge variant={user.role === "admin" ? "default" : "secondary"}>{user.role}</Badge>
                          <Badge variant={user.status === "active" ? "default" : "destructive"}>{user.status}</Badge>
                        </div>
                        <div className="mt-2 text-sm text-muted-foreground">
                          {user.department && `${user.department} • `}
                          {user.semester && `Semester ${user.semester} • `}
                          Joined {user.joinDate}
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <Button size="sm" variant="outline">
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button size="sm" variant="outline">
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </>
        )}

        {activeView === "admin-content" && currentUser?.role === "admin" && (
          <>
            <div className="flex items-center justify-between mb-8">
              <div>
                <h2 className="text-3xl font-serif font-bold">Content Management</h2>
                <p className="text-muted-foreground">Upload and manage study materials</p>
              </div>
              <Dialog open={isUploadDialogOpen} onOpenChange={setIsUploadDialogOpen}>
                <DialogTrigger asChild>
                  <Button>
                    <Upload className="h-4 w-4 mr-2" />
                    Upload Material
                  </Button>
                </DialogTrigger>
                <DialogContent className="max-w-md">
                  <DialogHeader>
                    <DialogTitle>Upload Study Material</DialogTitle>
                    <DialogDescription>Add new notes or question papers to the system</DialogDescription>
                  </DialogHeader>
                  <form onSubmit={handleUploadMaterial} className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="upload-title">Title</Label>
                      <Input
                        id="upload-title"
                        placeholder="Enter material title"
                        value={uploadData.title}
                        onChange={(e) => setUploadData({ ...uploadData, title: e.target.value })}
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="upload-type">Type</Label>
                      <Select
                        value={uploadData.type}
                        onValueChange={(value: "note" | "question-paper") =>
                          setUploadData({ ...uploadData, type: value })
                        }
                      >
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="note">Study Note</SelectItem>
                          <SelectItem value="question-paper">Question Paper</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="upload-department">Department</Label>
                      <Select
                        value={uploadData.department}
                        onValueChange={(value) => setUploadData({ ...uploadData, department: value })}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Select department" />
                        </SelectTrigger>
                        <SelectContent>
                          {departments.map((dept) => (
                            <SelectItem key={dept} value={dept}>
                              {dept}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="upload-semester">Semester</Label>
                      <Select
                        value={uploadData.semester.toString()}
                        onValueChange={(value) => setUploadData({ ...uploadData, semester: Number.parseInt(value) })}
                      >
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          {[1, 2, 3, 4, 5, 6, 7, 8].map((sem) => (
                            <SelectItem key={sem} value={sem.toString()}>
                              Semester {sem}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="upload-subject">Subject</Label>
                      <Input
                        id="upload-subject"
                        placeholder="Enter subject name"
                        value={uploadData.subject}
                        onChange={(e) => setUploadData({ ...uploadData, subject: e.target.value })}
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="upload-description">Description</Label>
                      <Textarea
                        id="upload-description"
                        placeholder="Enter material description"
                        value={uploadData.description}
                        onChange={(e) => setUploadData({ ...uploadData, description: e.target.value })}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="upload-file">File</Label>
                      <Input
                        id="upload-file"
                        type="file"
                        accept=".pdf,.doc,.docx,.ppt,.pptx"
                        onChange={handleFileSelect}
                        required
                      />
                      {selectedFile && (
                        <p className="text-sm text-muted-foreground">
                          Selected: {selectedFile.name} ({(selectedFile.size / 1024 / 1024).toFixed(2)} MB)
                        </p>
                      )}
                    </div>
                    <Button type="submit" className="w-full" disabled={isUploading}>
                      {isUploading ? "Uploading..." : "Upload Material"}
                    </Button>
                  </form>
                </DialogContent>
              </Dialog>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-muted-foreground">Total Materials</p>
                      <p className="text-2xl font-bold">{mockMaterials.length}</p>
                    </div>
                    <FileText className="h-8 w-8 text-primary" />
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-muted-foreground">Pending Review</p>
                      <p className="text-2xl font-bold">{mockMaterials.filter((m) => m.status === "pending").length}</p>
                    </div>
                    <Settings className="h-8 w-8 text-secondary" />
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-muted-foreground">Active Materials</p>
                      <p className="text-2xl font-bold">{mockMaterials.filter((m) => m.status === "active").length}</p>
                    </div>
                    <BookOpen className="h-8 w-8 text-primary" />
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-muted-foreground">Total Downloads</p>
                      <p className="text-2xl font-bold">{mockMaterials.reduce((sum, m) => sum + m.downloads, 0)}</p>
                    </div>
                    <Download className="h-8 w-8 text-secondary" />
                  </div>
                </CardContent>
              </Card>
            </div>

            <Card>
              <CardHeader>
                <CardTitle>All Materials</CardTitle>
                <CardDescription>Manage uploaded study materials and question papers</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {mockMaterials.map((material) => (
                    <div key={material.id} className="flex items-center justify-between p-4 border rounded-lg">
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-2">
                          <h4 className="font-medium">{material.title}</h4>
                          <Badge variant={material.type === "note" ? "default" : "secondary"}>
                            {material.type === "note" ? "Note" : "Question Paper"}
                          </Badge>
                          <Badge
                            variant={
                              material.status === "active"
                                ? "default"
                                : material.status === "pending"
                                  ? "secondary"
                                  : "destructive"
                            }
                          >
                            {material.status}
                          </Badge>
                        </div>
                        <div className="text-sm text-muted-foreground">
                          {material.department} • Semester {material.semester} • {material.subject} •{" "}
                          {material.fileSize}
                        </div>
                        <div className="text-sm text-muted-foreground">
                          Uploaded by {material.uploadedBy} • {material.downloads} downloads • {material.rating} rating
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <Button size="sm" variant="outline">
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button size="sm" variant="outline">
                          <Download className="h-4 w-4" />
                        </Button>
                        <Button size="sm" variant="outline">
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </>
        )}

        {activeView === "admin-analytics" && currentUser?.role === "admin" && (
          <>
            <div className="text-center mb-12">
              <h2 className="text-4xl font-serif font-bold mb-4">Analytics Dashboard</h2>
              <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
                Monitor system usage and performance metrics
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-muted-foreground">Total Downloads</p>
                      <p className="text-2xl font-bold">{mockMaterials.reduce((sum, m) => sum + m.downloads, 0)}</p>
                      <p className="text-xs text-green-600">+12% from last month</p>
                    </div>
                    <Download className="h-8 w-8 text-primary" />
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-muted-foreground">Active Users</p>
                      <p className="text-2xl font-bold">{mockUsers.filter((u) => u.status === "active").length}</p>
                      <p className="text-xs text-green-600">+5% from last month</p>
                    </div>
                    <Users className="h-8 w-8 text-secondary" />
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-muted-foreground">Avg Rating</p>
                      <p className="text-2xl font-bold">
                        {(mockMaterials.reduce((sum, m) => sum + m.rating, 0) / mockMaterials.length).toFixed(1)}
                      </p>
                      <p className="text-xs text-green-600">+0.2 from last month</p>
                    </div>
                    <Star className="h-8 w-8 text-primary" />
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-muted-foreground">Storage Used</p>
                      <p className="text-2xl font-bold">2.4 GB</p>
                      <p className="text-xs text-muted-foreground">of 10 GB limit</p>
                    </div>
                    <BarChart3 className="h-8 w-8 text-secondary" />
                  </div>
                </CardContent>
              </Card>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              <Card>
                <CardHeader>
                  <CardTitle>Popular Departments</CardTitle>
                  <CardDescription>Most accessed departments by download count</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {departments.slice(0, 5).map((dept) => {
                      const deptDownloads = mockMaterials
                        .filter((m) => m.department === dept)
                        .reduce((sum, m) => sum + m.downloads, 0)
                      return (
                        <div key={dept} className="flex items-center justify-between">
                          <span className="font-medium">{dept}</span>
                          <Badge variant="secondary">{deptDownloads} downloads</Badge>
                        </div>
                      )
                    })}
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Recent Activity</CardTitle>
                  <CardDescription>Latest system activities and uploads</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex items-center gap-3">
                      <Upload className="h-4 w-4 text-primary" />
                      <div className="flex-1">
                        <p className="text-sm font-medium">New material uploaded</p>
                        <p className="text-xs text-muted-foreground">Operating Systems notes by Dr. Johnson</p>
                      </div>
                      <span className="text-xs text-muted-foreground">2h ago</span>
                    </div>
                    <div className="flex items-center gap-3">
                      <Users className="h-4 w-4 text-secondary" />
                      <div className="flex-1">
                        <p className="text-sm font-medium">New user registered</p>
                        <p className="text-xs text-muted-foreground">Sarah Wilson joined Mathematics dept</p>
                      </div>
                      <span className="text-xs text-muted-foreground">4h ago</span>
                    </div>
                    <div className="flex items-center gap-3">
                      <Download className="h-4 w-4 text-primary" />
                      <div className="flex-1">
                        <p className="text-sm font-medium">High download activity</p>
                        <p className="text-xs text-muted-foreground">DBMS question paper reached 200 downloads</p>
                      </div>
                      <span className="text-xs text-muted-foreground">6h ago</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </>
        )}

        {activeView === "admin-departments" && currentUser?.role === "admin" && (
          <>
            <div className="flex items-center justify-between mb-8">
              <div>
                <h2 className="text-3xl font-serif font-bold">Department Management</h2>
                <p className="text-muted-foreground">Manage academic departments and their configurations</p>
              </div>
              <Dialog open={isDepartmentDialogOpen} onOpenChange={setIsDepartmentDialogOpen}>
                <DialogTrigger asChild>
                  <Button>
                    <Plus className="h-4 w-4 mr-2" />
                    Add Department
                  </Button>
                </DialogTrigger>
                <DialogContent className="max-w-md">
                  <DialogHeader>
                    <DialogTitle>Create New Department</DialogTitle>
                    <DialogDescription>Add a new academic department to the system</DialogDescription>
                  </DialogHeader>
                  <form onSubmit={handleCreateDepartment} className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="dept-name">Department Name</Label>
                      <Input
                        id="dept-name"
                        placeholder="e.g., Computer Science"
                        value={departmentData.name}
                        onChange={(e) => setDepartmentData({ ...departmentData, name: e.target.value })}
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="dept-code">Department Code</Label>
                      <Input
                        id="dept-code"
                        placeholder="e.g., CS"
                        value={departmentData.code}
                        onChange={(e) => setDepartmentData({ ...departmentData, code: e.target.value.toUpperCase() })}
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="dept-description">Description</Label>
                      <Textarea
                        id="dept-description"
                        placeholder="Brief description of the department"
                        value={departmentData.description}
                        onChange={(e) => setDepartmentData({ ...departmentData, description: e.target.value })}
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="dept-semesters">Total Semesters</Label>
                      <Select
                        value={departmentData.totalSemesters.toString()}
                        onValueChange={(value) =>
                          setDepartmentData({ ...departmentData, totalSemesters: Number.parseInt(value) })
                        }
                      >
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          {[4, 6, 8].map((sem) => (
                            <SelectItem key={sem} value={sem.toString()}>
                              {sem} Semesters
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="dept-subjects">Core Subjects</Label>
                      <Textarea
                        id="dept-subjects"
                        placeholder="Enter subjects separated by commas"
                        value={departmentData.subjects}
                        onChange={(e) => setDepartmentData({ ...departmentData, subjects: e.target.value })}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="dept-hod">Head of Department</Label>
                      <Input
                        id="dept-hod"
                        placeholder="e.g., Dr. John Smith"
                        value={departmentData.headOfDepartment}
                        onChange={(e) => setDepartmentData({ ...departmentData, headOfDepartment: e.target.value })}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="dept-year">Established Year</Label>
                      <Input
                        id="dept-year"
                        type="number"
                        min="1900"
                        max={new Date().getFullYear()}
                        value={departmentData.establishedYear}
                        onChange={(e) =>
                          setDepartmentData({ ...departmentData, establishedYear: Number.parseInt(e.target.value) })
                        }
                        required
                      />
                    </div>
                    <Button type="submit" className="w-full">
                      Create Department
                    </Button>
                  </form>
                </DialogContent>
              </Dialog>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-muted-foreground">Total Departments</p>
                      <p className="text-2xl font-bold">{mockDepartments.length}</p>
                    </div>
                    <Building2 className="h-8 w-8 text-primary" />
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-muted-foreground">Active Departments</p>
                      <p className="text-2xl font-bold">
                        {mockDepartments.filter((d) => d.status === "active").length}
                      </p>
                    </div>
                    <UserCheck className="h-8 w-8 text-secondary" />
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-muted-foreground">Total Students</p>
                      <p className="text-2xl font-bold">
                        {mockDepartments.reduce((sum, d) => sum + d.studentCount, 0)}
                      </p>
                    </div>
                    <GraduationCap className="h-8 w-8 text-primary" />
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-muted-foreground">Total Materials</p>
                      <p className="text-2xl font-bold">
                        {mockDepartments.reduce((sum, d) => sum + d.materialCount, 0)}
                      </p>
                    </div>
                    <FileText className="h-8 w-8 text-secondary" />
                  </div>
                </CardContent>
              </Card>
            </div>

            <Card>
              <CardHeader>
                <CardTitle>All Departments</CardTitle>
                <CardDescription>Manage department information and settings</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {mockDepartments.map((dept) => (
                    <div key={dept.id} className="flex items-center justify-between p-4 border rounded-lg">
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-2">
                          <h4 className="font-medium">{dept.name}</h4>
                          <Badge variant="secondary">{dept.code}</Badge>
                          <Badge variant={dept.status === "active" ? "default" : "destructive"}>{dept.status}</Badge>
                        </div>
                        <p className="text-sm text-muted-foreground mb-2">{dept.description}</p>
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm text-muted-foreground">
                          <div className="flex items-center gap-1">
                            <Users className="h-4 w-4" />
                            {dept.studentCount} students
                          </div>
                          <div className="flex items-center gap-1">
                            <Calendar className="h-4 w-4" />
                            {dept.totalSemesters} semesters
                          </div>
                          <div className="flex items-center gap-1">
                            <FileText className="h-4 w-4" />
                            {dept.materialCount} materials
                          </div>
                          <div className="flex items-center gap-1">
                            <GraduationCap className="h-4 w-4" />
                            Est. {dept.establishedYear}
                          </div>
                        </div>
                        <div className="mt-2 text-sm text-muted-foreground">Head: {dept.headOfDepartment}</div>
                        <div className="mt-2">
                          <p className="text-xs text-muted-foreground">Core Subjects:</p>
                          <div className="flex flex-wrap gap-1 mt-1">
                            {dept.subjects.slice(0, 3).map((subject, index) => (
                              <Badge key={index} variant="outline" className="text-xs">
                                {subject}
                              </Badge>
                            ))}
                            {dept.subjects.length > 3 && (
                              <Badge variant="outline" className="text-xs">
                                +{dept.subjects.length - 3} more
                              </Badge>
                            )}
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <Button size="sm" variant="outline">
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button size="sm" variant="outline">
                          <Settings className="h-4 w-4" />
                        </Button>
                        <Button size="sm" variant="outline">
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </>
        )}
        {activeView === "uploaded-notes" && currentUser?.role === "admin" && (
          <>
            <div className="flex items-center justify-between mb-8">
              <div>
                <h2 className="text-3xl font-serif font-bold">Uploaded Notes</h2>
                <p className="text-muted-foreground">View and manage all uploaded files</p>
              </div>
              <Button onClick={fetchUploadedNotes}>
                <Download className="h-4 w-4 mr-2" />
                Refresh
              </Button>
            </div>

            <Card>
              <CardHeader>
                <CardTitle>All Uploaded Files</CardTitle>
                <CardDescription>Files uploaded through the system</CardDescription>
              </CardHeader>
              <CardContent>
                {uploadedNotes.length === 0 ? (
                  <div className="text-center py-8">
                    <FileText className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                    <h3 className="text-lg font-medium mb-2">No files uploaded yet</h3>
                    <p className="text-muted-foreground">Upload your first file using the Content Management section</p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {uploadedNotes.map((note) => (
                      <div key={note.id} className="flex items-center justify-between p-4 border rounded-lg">
                        <div className="flex-1">
                          <h4 className="font-medium">{note.title}</h4>
                          <p className="text-sm text-muted-foreground">
                            Path: {note.storage_path} • Size: {(note.size / 1024 / 1024).toFixed(2)} MB
                          </p>
                          <p className="text-sm text-muted-foreground">
                            Views: {note.views_count} • Downloads: {note.downloads_count}
                          </p>
                          <p className="text-xs text-muted-foreground">
                            Uploaded: {new Date(note.created_at).toLocaleDateString()}
                          </p>
                        </div>
                        <div className="flex items-center gap-2">
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={async () => {
                              try {
                                const response = await fetch(`/api/notes/download?id=${note.id}`)
                                const result = await response.json()
                                if (response.ok) {
                                  window.open(result.url, "_blank")
                                } else {
                                  alert(`Download failed: ${result.error}`)
                                }
                              } catch (error) {
                                alert("Download failed")
                              }
                            }}
                          >
                            <Download className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </>
        )}
      </div>
      <AuthDialog
        isOpen={isAuthDialogOpen}
        onClose={() => setIsAuthDialogOpen(false)}
        onAuthSuccess={() => {
          fetchUploadedNotes()
        }}
      />
    </div>
  )
}
