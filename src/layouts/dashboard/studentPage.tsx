import React, { useState, useEffect } from "react";


import { collection, getDocs, doc as firestoreDoc, updateDoc, deleteDoc, addDoc } from "firebase/firestore";
import { db } from "src/sections/auth/firebaseConfig";


import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  TextField,
} from "@mui/material";

interface Student {
  docId?: string; 
  RollNo: number;
  name: string;
  Department: string;
  Section: string;
  Gender: string;
  Email: string;
  Contact: number;
  City: string;
  DOB: string;
  CGPA: number;
  Hobbies: string[];
  status: boolean;
}

const StudentPage: React.FC = () => {
  const [students, setStudents] = useState<Student[]>([]);
  const [currentStudent, setCurrentStudent] = useState<Student | null>(null);
  const [openDialog, setOpenDialog] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});


  useEffect(() => {
    fetchStudents();
  }, []);
  const validateStudent = (student: Student | null): boolean => {
    if (!student) return false;
  
    const newErrors: Record<string, string> = {};
  
    if (!student.RollNo || student.RollNo <= 0) {
      newErrors.RollNo = "Roll No must be a positive number.";
    }
    if (!student.name.trim()) {
      newErrors.name = "Name is required.";
    }
    if (!student.Department.trim()) {
      newErrors.Department = "Department is required.";
    }
    if (!student.Section.trim()) {
      newErrors.Section = "Section is required.";
    }
    if (!["Male", "Female", "Other"].includes(student.Gender)) {
      newErrors.Gender = "Gender must be Male, Female, or Other.";
    }
    if (!student.Email.trim() || !/^\S+@\S+\.\S+$/.test(student.Email)) {
      newErrors.Email = "A valid email is required.";
    }
    if (!student.Contact || student.Contact.toString().length < 10) {
      newErrors.Contact = "Contact must be at least 10 digits.";
    }
    if (!student.City.trim()) {
      newErrors.City = "City is required.";
    }
    if (!student.DOB.trim()) {
      newErrors.DOB = "Date of birth is required.";
    }
    if (!student.CGPA || student.CGPA < 0 || student.CGPA > 10) {
      newErrors.CGPA = "CGPA must be between 0 and 10.";
    }
    if (!Array.isArray(student.Hobbies) || student.Hobbies.length === 0) {
      newErrors.Hobbies = "At least one hobby is required.";
    }
  
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };
  
  const fetchStudents = async () => {
    const colRef = collection(db, "students");
    const snapshot = await getDocs(colRef);
    const studentList = snapshot.docs.map((document) => ({
      docId: document.id, 
      ...(document.data() as Student),
    }));
    setStudents(studentList);
  };

  const openFormDialog = (student?: Student) => {
    setCurrentStudent(
      student || {
        RollNo: 0,
        name: "",
        Department: "",
        Section: "",
        Gender: "",
        Email: "",
        Contact: 0,
        City: "",
        DOB: "",
        CGPA: 0,
        Hobbies: [],
        status: true,
      }
    );
    setIsEditing(!!student);
    setOpenDialog(true);
  };

  const closeFormDialog = () => {
    setOpenDialog(false);
    setCurrentStudent(null);
  };

  const handleSave = async () => {
    if (!currentStudent || !validateStudent(currentStudent)) {
      return; 
    }
  
    if (isEditing && currentStudent.docId) {
      const docRef = firestoreDoc(db, "students", currentStudent.docId);
      await updateDoc(docRef, { ...currentStudent } as Record<string, any>);
    } else {
      const colRef = collection(db, "students");
      await addDoc(colRef, { ...currentStudent });
    }
  
    fetchStudents();
    closeFormDialog();
  };
  
  const handleDelete = async (docId: string) => {
    const docRef = firestoreDoc(db, "students", docId);
    await deleteDoc(docRef);
    fetchStudents();
  };

  return (
    <div>
      <h1>Student Management</h1>
      <Button variant="contained" color="primary" onClick={() => openFormDialog()}>
        Add Student
      </Button>

      <TableContainer>
        <Table>
        <TableHead>
  <TableRow>
    <TableCell>Roll No</TableCell>
    <TableCell>Name</TableCell>
    <TableCell>Department</TableCell>
    <TableCell>Section</TableCell>
    <TableCell>Gender</TableCell>
    <TableCell>Email</TableCell>
    <TableCell>Contact</TableCell>
    <TableCell>City</TableCell>
    <TableCell>DOB</TableCell>
    <TableCell>CGPA</TableCell>
    <TableCell>Hobbies</TableCell>
    <TableCell>Status</TableCell>
    <TableCell>Actions</TableCell>
  </TableRow>
</TableHead>
          <TableBody>
          {students.map((student) => (
    <TableRow key={student.docId}>
      <TableCell>{student.RollNo}</TableCell>
      <TableCell>{student.name}</TableCell>
      <TableCell>{student.Department}</TableCell>
      <TableCell>{student.Section}</TableCell>
      <TableCell>{student.Gender}</TableCell>
      <TableCell>{student.Email}</TableCell>
      <TableCell>{student.Contact}</TableCell>
      <TableCell>{student.City}</TableCell>
      <TableCell>{student.DOB}</TableCell>
      <TableCell>{student.CGPA}</TableCell>
      <TableCell>{student.Hobbies.join(", ")}</TableCell>
      <TableCell>{student.status ? "Active" : "Inactive"}</TableCell>
      <TableCell>
        <Button
          size="small"
          color="primary"
          onClick={() => openFormDialog(student)}
        >
          Edit
        </Button>
        <Button
          size="small"
          color="error"
          onClick={() => handleDelete(student.docId!)}
        >
          Delete
        </Button>
      </TableCell>
    </TableRow>
  ))}
          </TableBody>
        </Table>
      </TableContainer>

      <Dialog open={openDialog} onClose={closeFormDialog} fullWidth>
        <DialogTitle>{isEditing ? "Edit Student" : "Add Student"}</DialogTitle>
        <DialogContent>
  <TextField
    label="Roll No"
    type="number"
    fullWidth
    margin="normal"
    value={currentStudent?.RollNo || ""}
    error={!!errors.RollNo}
    helperText={errors.RollNo}
    onChange={(e) =>
      setCurrentStudent((prev) =>
        prev ? { ...prev, RollNo: parseInt(e.target.value, 10) } : null
      )
    }
  />
  <TextField
    label="Name"
    fullWidth
    margin="normal"
    value={currentStudent?.name || ""}
    error={!!errors.name}
    helperText={errors.name}
    onChange={(e) =>
      setCurrentStudent((prev) =>
        prev ? { ...prev, name: e.target.value } : null
      )
    }
  />
  <TextField
    label="Department"
    fullWidth
    margin="normal"
    value={currentStudent?.Department || ""}
    error={!!errors.Department}
    helperText={errors.Department}
    onChange={(e) =>
      setCurrentStudent((prev) =>
        prev ? { ...prev, Department: e.target.value } : null
      )
    }
  />
  <TextField
    label="Section"
    fullWidth
    margin="normal"
    value={currentStudent?.Section || ""}
    error={!!errors.Section}
    helperText={errors.Section}
    onChange={(e) =>
      setCurrentStudent((prev) =>
        prev ? { ...prev, Section: e.target.value } : null
      )
    }
  />
  <TextField
    label="Gender"
    fullWidth
    margin="normal"
    value={currentStudent?.Gender || ""}
    error={!!errors.Gender}
    helperText={errors.Gender}
    onChange={(e) =>
      setCurrentStudent((prev) =>
        prev ? { ...prev, Gender: e.target.value } : null
      )
    }
  />
  <TextField
    label="Email"
    fullWidth
    margin="normal"
    value={currentStudent?.Email || ""}
    error={!!errors.Email}
    helperText={errors.Email}
    onChange={(e) =>
      setCurrentStudent((prev) =>
        prev ? { ...prev, Email: e.target.value } : null
      )
    }
  />
  <TextField
    label="Contact"
    type="number"
    fullWidth
    margin="normal"
    value={currentStudent?.Contact || ""}
    error={!!errors.Contact}
    helperText={errors.Contact}
    onChange={(e) =>
      setCurrentStudent((prev) =>
        prev ? { ...prev, Contact: parseInt(e.target.value, 10) } : null
      )
    }
  />
  <TextField
    label="City"
    fullWidth
    margin="normal"
    value={currentStudent?.City || ""}
    error={!!errors.City}
    helperText={errors.City}
    onChange={(e) =>
      setCurrentStudent((prev) =>
        prev ? { ...prev, City: e.target.value } : null
      )
    }
  />
  <TextField
    label="DOB"
    fullWidth
    margin="normal"
    value={currentStudent?.DOB || ""}
    error={!!errors.DOB}
    helperText={errors.DOB}
    onChange={(e) =>
      setCurrentStudent((prev) =>
        prev ? { ...prev, DOB: e.target.value } : null
      )
    }
  />
  <TextField
    label="CGPA"
    type="number"
    fullWidth
    margin="normal"
    value={currentStudent?.CGPA || ""}
    error={!!errors.CGPA}
    helperText={errors.CGPA}
    onChange={(e) =>
      setCurrentStudent((prev) =>
        prev ? { ...prev, CGPA: parseFloat(e.target.value) } : null
      )
    }
  />
  <TextField
    label="Hobbies"
    fullWidth
    margin="normal"
    value={(currentStudent?.Hobbies || []).join(", ")}
    error={!!errors.Hobbies}
    helperText={errors.Hobbies}
    onChange={(e) =>
      setCurrentStudent((prev) =>
        prev
          ? {
              ...prev,
              Hobbies: e.target.value.split(",").map((hobby) => hobby.trim()),
            }
          : null
      )
    }
  />
  <TextField
    label="Status"
    fullWidth
    margin="normal"
    select
    SelectProps={{
      native: true,
    }}
    value={currentStudent?.status ? "Active" : "Inactive"}
    error={!!errors.status}
    helperText={errors.status}
    onChange={(e) =>
      setCurrentStudent((prev) =>
        prev ? { ...prev, status: e.target.value === "Active" } : null
      )
    }
  >
    <option value="Active">Active</option>
    <option value="Inactive">Inactive</option>
  </TextField>
</DialogContent>

        <DialogActions>
          <Button onClick={closeFormDialog}>Cancel</Button>
          <Button onClick={handleSave} color="primary">
            Save
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
};

export default StudentPage;
