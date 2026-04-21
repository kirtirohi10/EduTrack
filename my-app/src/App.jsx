import { useState, useEffect, useRef } from "react";

// ─── In-Memory Database ───────────────────────────────────────────────────────
const DB_INITIAL = {
  users: [
    { id: "u1", name: "Arjun Sharma", email: "arjun@college.edu", password: "student123", role: "student", rollNo: "CS2021001", branch: "CSE", year: 3, avatar: "AS", onboarded: true, course: "B.Tech", startYear: "2021", endYear: "2025", teacherName: "Dr. Kavitha Nair", subjectNames: "Data Structures, Operating Systems, DBMS" },
    { id: "u2", name: "Priya Patel", email: "priya@college.edu", password: "student123", role: "student", rollNo: "CS2021042", branch: "CSE", year: 3, avatar: "PP", onboarded: true, course: "B.Tech", startYear: "2021", endYear: "2025", teacherName: "Dr. Kavitha Nair", subjectNames: "Data Structures, Operating Systems, DBMS" },
    { id: "u3", name: "Rohan Mehta", email: "rohan@college.edu", password: "student123", role: "student", rollNo: "IT2022015", branch: "IT", year: 2, avatar: "RM", onboarded: true, course: "B.Tech", startYear: "2022", endYear: "2026", teacherName: "Prof. Suresh Kumar", subjectNames: "Web Technologies" },
    { id: "f1", name: "Dr. Kavitha Nair", email: "kavitha@college.edu", password: "faculty123", role: "faculty", dept: "CSE", avatar: "KN", onboarded: true, subjectsTaught: "Data Structures, Operating Systems, DBMS" },
    { id: "f2", name: "Prof. Suresh Kumar", email: "suresh@college.edu", password: "faculty123", role: "faculty", dept: "IT", avatar: "SK", onboarded: true, subjectsTaught: "Web Technologies" },
    { id: "a1", name: "Admin Portal", email: "admin@college.edu", password: "admin123", role: "admin", avatar: "AP", onboarded: true },
  ],
  subjects: [
    { id: "s1", name: "Data Structures", code: "CS301", faculty: "f1", branch: "CSE", year: 3 },
    { id: "s2", name: "Operating Systems", code: "CS302", faculty: "f1", branch: "CSE", year: 3 },
    { id: "s3", name: "DBMS", code: "CS303", faculty: "f2", branch: "CSE", year: 3 },
    { id: "s4", name: "Web Technologies", code: "IT201", faculty: "f2", branch: "IT", year: 2 },
  ],
  attendance: [
    { id: "a1", studentId: "u1", subjectId: "s1", totalClasses: 45, attended: 36, adjusted: 0 },
    { id: "a2", studentId: "u1", subjectId: "s2", totalClasses: 42, attended: 30, adjusted: 0 },
    { id: "a3", studentId: "u1", subjectId: "s3", totalClasses: 40, attended: 34, adjusted: 0 },
    { id: "a4", studentId: "u2", subjectId: "s1", totalClasses: 45, attended: 40, adjusted: 0 },
    { id: "a5", studentId: "u2", subjectId: "s2", totalClasses: 42, attended: 38, adjusted: 0 },
    { id: "a6", studentId: "u2", subjectId: "s3", totalClasses: 40, attended: 35, adjusted: 0 },
    { id: "a7", studentId: "u3", subjectId: "s4", totalClasses: 38, attended: 25, adjusted: 0 },
  ],
  submissions: [
    { id: "sub1", studentId: "u1", title: "TechFest 2024 — Winner", type: "fest", activityDate: "2024-10-12", missedClasses: 2, subjects: ["s1", "s2"], description: "Won 1st place in national hackathon at IIT Bombay TechFest", status: "approved", reviewedBy: "f1", reviewNote: "Certificate verified. Attendance granted.", submittedAt: "2024-10-15T09:30:00", reviewedAt: "2024-10-16T11:00:00", docName: "techfest_certificate.pdf" },
    { id: "sub2", studentId: "u1", title: "Google Internship — Week 1", type: "internship", activityDate: "2024-11-04", missedClasses: 3, subjects: ["s1", "s3"], description: "Internship at Google Bangalore — first week orientation", status: "pending", reviewedBy: null, reviewNote: null, submittedAt: "2024-11-05T14:20:00", reviewedAt: null, docName: "google_offer_letter.pdf" },
    { id: "sub3", studentId: "u2", title: "Smart India Hackathon", type: "competition", activityDate: "2024-09-22", missedClasses: 1, subjects: ["s2"], description: "Participated in SIH 2024 — national level", status: "rejected", reviewedBy: "f1", reviewNote: "Proof insufficient — submit official letter.", submittedAt: "2024-09-25T10:10:00", reviewedAt: "2024-09-26T09:00:00", docName: "sih_participation.jpg" },
    { id: "sub4", studentId: "u3", title: "IEEE Conference Paper", type: "conference", activityDate: "2024-10-30", missedClasses: 2, subjects: ["s4"], description: "Presented paper at IEEE ICECCE 2024", status: "pending", reviewedBy: null, reviewNote: null, submittedAt: "2024-11-01T16:45:00", reviewedAt: null, docName: "ieee_paper_proof.pdf" },
  ],
  notifications: [
    { id: "n1", userId: "u1", message: "Your TechFest submission has been approved!", type: "success", read: false, time: "2024-10-16T11:00:00" },
    { id: "n2", userId: "u1", message: "Google Internship submission is under review.", type: "info", read: false, time: "2024-11-05T14:20:00" },
    { id: "n3", userId: "u2", message: "SIH submission rejected — please resubmit with better proof.", type: "error", read: false, time: "2024-09-26T09:00:00" },
    { id: "n4", userId: "f1", message: "New submission from Arjun Sharma awaits review.", type: "info", read: false, time: "2024-11-05T14:20:00" },
  ],
  auditLog: [
    { id: "al1", action: "APPROVE", userId: "f1", targetId: "sub1", detail: "Approved TechFest 2024 submission for Arjun Sharma", time: "2024-10-16T11:00:00" },
    { id: "al2", action: "REJECT", userId: "f1", targetId: "sub3", detail: "Rejected SIH submission for Priya Patel — insufficient proof", time: "2024-09-26T09:00:00" },
    { id: "al3", action: "SUBMIT", userId: "u1", targetId: "sub2", detail: "New submission: Google Internship — Week 1", time: "2024-11-05T14:20:00" },
  ],
};

// ─── Helpers ─────────────────────────────────────────────────────────────────
const pct = (a, t) => t > 0 ? Math.round((a / t) * 100) : 0;
const fmtDate = (iso) => iso ? new Date(iso).toLocaleDateString("en-IN", { day: "2-digit", month: "short", year: "numeric" }) : "—";
const fmtTime = (iso) => iso ? new Date(iso).toLocaleTimeString("en-IN", { hour: "2-digit", minute: "2-digit" }) : "—";
const typeColors = { fest: "#f59e0b", internship: "#6366f1", competition: "#ec4899", conference: "#10b981", other: "#64748b" };
const typeIcons = { fest: "🎪", internship: "💼", competition: "🏆", conference: "📄", other: "📎" };
const statusColors = { approved: "#10b981", pending: "#f59e0b", rejected: "#ef4444" };
const initials = (name) => name.split(" ").map(w => w[0]).join("").toUpperCase().slice(0, 2);

function getStudentAttendance(studentId, DB) {
  return DB.attendance.filter(a => a.studentId === studentId).map(a => {
    const subj = DB.subjects.find(s => s.id === a.subjectId);
    const adjAtt = a.attended + a.adjusted;
    return { ...a, subject: subj, adjAtt, pct: pct(adjAtt, a.totalClasses) };
  });
}

// ─── STUDENT ONBOARDING ────────────────────────────────────────────────────────
const STUDENT_ONBOARDING_STEPS = [
  { id: "personal", title: "Personal Info", icon: "👤", desc: "Tell us about yourself" },
  { id: "academic", title: "Academic Details", icon: "🎓", desc: "Your course & year" },
  { id: "teacher", title: "Your Teacher", icon: "👩‍🏫", desc: "Connect with faculty" },
  { id: "subjects", title: "Your Subjects", icon: "📚", desc: "Add your enrolled subjects" },
];

// ─── FACULTY ONBOARDING ────────────────────────────────────────────────────────
const FACULTY_ONBOARDING_STEPS = [
  { id: "personal", title: "Personal Info", icon: "👤", desc: "Tell us about yourself" },
  { id: "department", title: "Department", icon: "🏛️", desc: "Your department & role" },
  { id: "subjects", title: "Subjects You Teach", icon: "📚", desc: "Add subjects you teach" },
];

function FacultyOnboardingFlow({ user, data, setData, onComplete, showToast }) {
  const [step, setStep] = useState(0);
  const [form, setForm] = useState({
    name: user.name || "",
    dept: "CSE",
    designation: "Assistant Professor",
    subjectsTaught: "",
  });

  const update = (field, val) => setForm(f => ({ ...f, [field]: val }));
  const isLast = step === FACULTY_ONBOARDING_STEPS.length - 1;

  const handleNext = () => {
    if (step === 0 && !form.name) { showToast("Please fill your name.", "error"); return; }
    if (step === 1 && (!form.dept || !form.designation)) { showToast("Please complete department details.", "error"); return; }
    if (step === 2 && !form.subjectsTaught) { showToast("Please enter at least one subject.", "error"); return; }

    if (isLast) {
      const updatedUser = {
        ...user,
        name: form.name,
        avatar: initials(form.name),
        dept: form.dept,
        designation: form.designation,
        subjectsTaught: form.subjectsTaught,
        onboarded: true,
      };

      // Auto-link students whose subjectNames match this faculty's subjectsTaught
      const facultySubjects = form.subjectsTaught.split(",").map(s => s.trim().toLowerCase()).filter(Boolean);

      // Notify matching students
      const newNotifications = [...data.notifications];
      const newAuditLog = [...data.auditLog];

      data.users.filter(u => u.role === "student" && u.subjectNames).forEach(student => {
        const studentSubjects = student.subjectNames.split(",").map(s => s.trim().toLowerCase());
        const matches = studentSubjects.filter(ss => facultySubjects.some(fs => ss.includes(fs) || fs.includes(ss)));
        if (matches.length > 0) {
          newNotifications.push({
            id: "n" + Date.now() + student.id,
            userId: student.id,
            message: `${form.name} (${form.dept}) joined as your faculty for: ${matches.join(", ")}`,
            type: "info", read: false, time: new Date().toISOString(),
          });
        }
      });

      newAuditLog.push({
        id: "al" + Date.now(), action: "REGISTER",
        userId: updatedUser.id, targetId: updatedUser.id,
        detail: `Faculty ${form.name} completed onboarding. Teaches: ${form.subjectsTaught}`,
        time: new Date().toISOString(),
      });

      setData(prev => ({
        ...prev,
        users: prev.users.map(u => u.id === user.id ? updatedUser : u),
        notifications: newNotifications,
        auditLog: newAuditLog,
      }));

      showToast(`Welcome aboard, ${form.name.split(" ")[0]}! 🎉`);
      onComplete(updatedUser);
    } else {
      setStep(s => s + 1);
    }
  };

  const inputStyle = {
    width: "100%", padding: "12px 14px",
    background: "#070a10", border: "1px solid #1e2535",
    borderRadius: 10, color: "#e2e8f0", fontSize: 14, outline: "none",
    fontFamily: "'DM Sans', sans-serif", transition: "border-color 0.2s",
  };
  const labelStyle = {
    display: "block", fontSize: 11, fontWeight: 700,
    color: "#475569", marginBottom: 6, textTransform: "uppercase", letterSpacing: "0.8px",
  };

  return (
    <div style={{ minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center", padding: 20, position: "relative", overflow: "hidden", background: "#070a10" }}>
      <div style={{ position: "absolute", inset: 0, background: "radial-gradient(ellipse 70% 50% at 50% -5%, #0f1f3d 0%, transparent 70%)" }} />
      <div style={{ position: "absolute", top: "20%", left: "5%", width: 400, height: 400, borderRadius: "50%", background: "radial-gradient(circle, rgba(16,185,129,0.08) 0%, transparent 70%)" }} />

      <div style={{ width: "100%", maxWidth: 540, position: "relative", zIndex: 2 }}>
        <div style={{ textAlign: "center", marginBottom: 32 }}>
          <div style={{ display: "inline-flex", alignItems: "center", justifyContent: "center", width: 56, height: 56, borderRadius: 16, background: "linear-gradient(135deg, #10b981, #6366f1)", marginBottom: 14, fontSize: 24 }}>👩‍🏫</div>
          <h1 style={{ fontSize: 22, fontWeight: 800, color: "#fff", letterSpacing: "-0.5px" }}>Faculty Profile Setup</h1>
          <p style={{ color: "#475569", fontSize: 13, marginTop: 4 }}>Help students find you by setting up your profile</p>
        </div>

        <div style={{ display: "flex", gap: 8, marginBottom: 28, justifyContent: "center" }}>
          {FACULTY_ONBOARDING_STEPS.map((s, i) => (
            <div key={s.id} style={{ display: "flex", alignItems: "center", gap: 8 }}>
              <div style={{
                width: 32, height: 32, borderRadius: "50%",
                background: i < step ? "#10b981" : i === step ? "linear-gradient(135deg,#10b981,#059669)" : "#111520",
                border: `2px solid ${i < step ? "#10b981" : i === step ? "#10b981" : "#1e2535"}`,
                display: "flex", alignItems: "center", justifyContent: "center",
                fontSize: i < step ? 14 : 12, color: i <= step ? "#fff" : "#334155", fontWeight: 700,
              }}>
                {i < step ? "✓" : s.icon}
              </div>
              {i < FACULTY_ONBOARDING_STEPS.length - 1 && (
                <div style={{ width: 36, height: 2, background: i < step ? "#10b981" : "#1e2535", borderRadius: 1 }} />
              )}
            </div>
          ))}
        </div>

        <div style={{ background: "#0d1018", border: "1px solid #1e2535", borderRadius: 20, padding: 32 }}>
          <div style={{ marginBottom: 24 }}>
            <h2 style={{ fontSize: 18, fontWeight: 800, color: "#fff" }}>{FACULTY_ONBOARDING_STEPS[step].icon} {FACULTY_ONBOARDING_STEPS[step].title}</h2>
            <p style={{ fontSize: 13, color: "#475569", marginTop: 3 }}>{FACULTY_ONBOARDING_STEPS[step].desc}</p>
          </div>

          {step === 0 && (
            <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
              <div>
                <label style={labelStyle}>Full Name *</label>
                <input value={form.name} onChange={e => update("name", e.target.value)} placeholder="e.g. Dr. Kavitha Nair" style={inputStyle} />
              </div>
              <div>
                <label style={labelStyle}>Designation *</label>
                <select value={form.designation} onChange={e => update("designation", e.target.value)} style={inputStyle}>
                  {["Assistant Professor", "Associate Professor", "Professor", "HOD", "Dean", "Lecturer", "Lab Instructor"].map(d => <option key={d}>{d}</option>)}
                </select>
              </div>
            </div>
          )}

          {step === 1 && (
            <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
              <div>
                <label style={labelStyle}>Department *</label>
                <select value={form.dept} onChange={e => update("dept", e.target.value)} style={inputStyle}>
                  {["CSE", "IT", "ECE", "EEE", "ME", "CE", "AI/ML", "DS", "MCA", "MBA"].map(d => <option key={d}>{d}</option>)}
                </select>
              </div>
              <div style={{ padding: "12px 16px", background: "#070a10", borderRadius: 10, border: "1px solid #1e2535", fontSize: 12, color: "#475569", lineHeight: 1.6 }}>
                💡 Your department helps students from your branch find you automatically.
              </div>
            </div>
          )}

          {step === 2 && (
            <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
              <div style={{ padding: "12px 16px", background: "#070a10", borderRadius: 10, border: "1px solid #1e2535", fontSize: 12, color: "#475569", lineHeight: 1.6 }}>
                📚 Enter the subjects you teach, separated by commas. Students who enrolled in these subjects will be automatically linked to you.
              </div>
              <div>
                <label style={labelStyle}>Subjects You Teach *</label>
                <textarea
                  value={form.subjectsTaught}
                  onChange={e => update("subjectsTaught", e.target.value)}
                  placeholder="e.g. Data Structures, Operating Systems, DBMS"
                  rows={4}
                  style={{ ...inputStyle, resize: "vertical" }}
                />
              </div>
              {form.subjectsTaught && (
                <div>
                  <label style={labelStyle}>Preview</label>
                  <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
                    {form.subjectsTaught.split(",").map(s => s.trim()).filter(Boolean).map((s, i) => (
                      <span key={i} style={{ padding: "5px 12px", background: "#1e3a2a", color: "#10b981", borderRadius: 20, fontSize: 12, fontWeight: 600 }}>{s}</span>
                    ))}
                  </div>
                </div>
              )}
              {/* Show which students will be auto-linked */}
              {form.subjectsTaught && (() => {
                const fs = form.subjectsTaught.split(",").map(s => s.trim().toLowerCase()).filter(Boolean);
                const matched = data.users.filter(u => u.role === "student" && u.subjectNames && fs.some(f => u.subjectNames.toLowerCase().split(",").map(x => x.trim()).some(ss => ss.includes(f) || f.includes(ss))));
                return matched.length > 0 ? (
                  <div style={{ padding: "12px 16px", background: "#0a1f15", borderRadius: 10, border: "1px solid #1e3a2a", fontSize: 12 }}>
                    <p style={{ color: "#10b981", fontWeight: 700, marginBottom: 6 }}>✓ Auto-linking {matched.length} student(s):</p>
                    {matched.map(s => <p key={s.id} style={{ color: "#475569" }}>• {s.name} ({s.rollNo})</p>)}
                  </div>
                ) : null;
              })()}
            </div>
          )}

          <div style={{ display: "flex", gap: 12, marginTop: 28 }}>
            {step > 0 && (
              <button onClick={() => setStep(s => s - 1)} style={{ padding: "12px 20px", background: "#111520", border: "1px solid #1e2535", borderRadius: 10, color: "#64748b", fontSize: 14, fontWeight: 600, cursor: "pointer" }}>← Back</button>
            )}
            <button onClick={handleNext} style={{ flex: 1, padding: "13px", background: "linear-gradient(135deg,#10b981,#059669)", border: "none", borderRadius: 10, color: "#fff", fontSize: 14, fontWeight: 700, cursor: "pointer" }}>
              {isLast ? "🚀 Complete Setup" : "Continue →"}
            </button>
          </div>
        </div>
        <p style={{ textAlign: "center", fontSize: 11, color: "#334155", marginTop: 16 }}>Step {step + 1} of {FACULTY_ONBOARDING_STEPS.length}</p>
      </div>
    </div>
  );
}

function StudentOnboardingFlow({ user, data, setData, onComplete, showToast }) {
  const [step, setStep] = useState(0);
  const [form, setForm] = useState({
    name: user.name || "", rollNo: "", course: "B.Tech", branch: "CSE",
    startYear: new Date().getFullYear().toString(), endYear: (new Date().getFullYear() + 4).toString(),
    year: "1", teacherName: "", teacherEmail: "", subjectNames: "",
  });

  const update = (field, val) => setForm(f => ({ ...f, [field]: val }));
  const isLast = step === STUDENT_ONBOARDING_STEPS.length - 1;

  const handleNext = () => {
    if (step === 0 && (!form.name || !form.rollNo)) { showToast("Please fill your name and roll number.", "error"); return; }
    if (step === 1 && (!form.course || !form.branch || !form.year)) { showToast("Please complete academic details.", "error"); return; }
    if (step === 2 && !form.teacherName) { showToast("Please enter your teacher's name.", "error"); return; }
    if (step === 3 && !form.subjectNames) { showToast("Please enter at least one subject.", "error"); return; }

    if (isLast) {
      const updatedUser = {
        ...user, name: form.name, avatar: initials(form.name), rollNo: form.rollNo,
        course: form.course, branch: form.branch, year: parseInt(form.year),
        startYear: form.startYear, endYear: form.endYear,
        teacherName: form.teacherName, teacherEmail: form.teacherEmail,
        subjectNames: form.subjectNames, onboarded: true,
      };

      const teacher = data.users.find(u => u.role === "faculty" && u.name.toLowerCase().includes(form.teacherName.toLowerCase()));
      const newNotifications = [...data.notifications];
      const newAuditLog = [...data.auditLog];

      if (teacher) {
        newNotifications.push({ id: "n" + Date.now(), userId: teacher.id, message: `New student ${form.name} (${form.rollNo}) joined your class! Subjects: ${form.subjectNames}`, type: "info", read: false, time: new Date().toISOString() });
      }
      newAuditLog.push({ id: "al" + Date.now(), action: "REGISTER", userId: updatedUser.id, targetId: teacher?.id || "unresolved", detail: `${form.name} completed onboarding`, time: new Date().toISOString() });

      setData(prev => ({ ...prev, users: prev.users.map(u => u.id === user.id ? updatedUser : u), notifications: newNotifications, auditLog: newAuditLog }));
      showToast(`Welcome aboard, ${form.name.split(" ")[0]}! 🎉`);
      onComplete(updatedUser);
    } else {
      setStep(s => s + 1);
    }
  };

  const inputStyle = { width: "100%", padding: "12px 14px", background: "#070a10", border: "1px solid #1e2535", borderRadius: 10, color: "#e2e8f0", fontSize: 14, outline: "none", fontFamily: "'DM Sans', sans-serif" };
  const labelStyle = { display: "block", fontSize: 11, fontWeight: 700, color: "#475569", marginBottom: 6, textTransform: "uppercase", letterSpacing: "0.8px" };

  return (
    <div style={{ minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center", padding: 20, position: "relative", overflow: "hidden", background: "#070a10" }}>
      <div style={{ position: "absolute", inset: 0, background: "radial-gradient(ellipse 70% 50% at 50% -5%, #0f1f3d 0%, transparent 70%)" }} />
      <div style={{ width: "100%", maxWidth: 540, position: "relative", zIndex: 2 }}>
        <div style={{ textAlign: "center", marginBottom: 32 }}>
          <div style={{ display: "inline-flex", alignItems: "center", justifyContent: "center", width: 56, height: 56, borderRadius: 16, background: "linear-gradient(135deg, #6366f1, #10b981)", marginBottom: 14, fontSize: 24 }}>🎓</div>
          <h1 style={{ fontSize: 22, fontWeight: 800, color: "#fff" }}>Complete Your Profile</h1>
          <p style={{ color: "#475569", fontSize: 13, marginTop: 4 }}>Just a few steps to get you set up</p>
        </div>
        <div style={{ display: "flex", gap: 8, marginBottom: 28, justifyContent: "center" }}>
          {STUDENT_ONBOARDING_STEPS.map((s, i) => (
            <div key={s.id} style={{ display: "flex", alignItems: "center", gap: 8 }}>
              <div style={{ width: 32, height: 32, borderRadius: "50%", background: i < step ? "#10b981" : i === step ? "linear-gradient(135deg,#6366f1,#4f46e5)" : "#111520", border: `2px solid ${i < step ? "#10b981" : i === step ? "#6366f1" : "#1e2535"}`, display: "flex", alignItems: "center", justifyContent: "center", fontSize: i < step ? 14 : 12, color: i <= step ? "#fff" : "#334155", fontWeight: 700 }}>
                {i < step ? "✓" : s.icon}
              </div>
              {i < STUDENT_ONBOARDING_STEPS.length - 1 && <div style={{ width: 36, height: 2, background: i < step ? "#10b981" : "#1e2535", borderRadius: 1 }} />}
            </div>
          ))}
        </div>
        <div style={{ background: "#0d1018", border: "1px solid #1e2535", borderRadius: 20, padding: 32 }}>
          <div style={{ marginBottom: 24 }}>
            <h2 style={{ fontSize: 18, fontWeight: 800, color: "#fff" }}>{STUDENT_ONBOARDING_STEPS[step].icon} {STUDENT_ONBOARDING_STEPS[step].title}</h2>
            <p style={{ fontSize: 13, color: "#475569", marginTop: 3 }}>{STUDENT_ONBOARDING_STEPS[step].desc}</p>
          </div>
          {step === 0 && (
            <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
              <div><label style={labelStyle}>Full Name *</label><input value={form.name} onChange={e => update("name", e.target.value)} placeholder="e.g. Aditya Sharma" style={inputStyle} /></div>
              <div><label style={labelStyle}>Roll Number *</label><input value={form.rollNo} onChange={e => update("rollNo", e.target.value)} placeholder="e.g. CS2024001" style={inputStyle} /></div>
            </div>
          )}
          {step === 1 && (
            <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 14 }}>
                <div><label style={labelStyle}>Course *</label><select value={form.course} onChange={e => update("course", e.target.value)} style={inputStyle}>{["B.Tech", "M.Tech", "BCA", "MCA", "B.Sc", "M.Sc", "MBA", "B.E"].map(c => <option key={c}>{c}</option>)}</select></div>
                <div><label style={labelStyle}>Branch *</label><select value={form.branch} onChange={e => update("branch", e.target.value)} style={inputStyle}>{["CSE", "IT", "ECE", "EEE", "ME", "CE", "AI/ML", "DS"].map(b => <option key={b}>{b}</option>)}</select></div>
                <div><label style={labelStyle}>Start Year *</label><input type="number" value={form.startYear} onChange={e => update("startYear", e.target.value)} min="2015" max="2030" style={inputStyle} /></div>
                <div><label style={labelStyle}>End Year *</label><input type="number" value={form.endYear} onChange={e => update("endYear", e.target.value)} min="2018" max="2035" style={inputStyle} /></div>
              </div>
              <div><label style={labelStyle}>Current Year *</label><select value={form.year} onChange={e => update("year", e.target.value)} style={inputStyle}>{["1","2","3","4","5"].map(y => <option key={y} value={y}>Year {y}</option>)}</select></div>
            </div>
          )}
          {step === 2 && (
            <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
              <div style={{ padding: "12px 16px", background: "#070a10", borderRadius: 10, border: "1px solid #1e2535", fontSize: 12, color: "#475569", lineHeight: 1.6 }}>
                💡 Available faculty: {data.users.filter(u => u.role === "faculty").map(f => `${f.name} (${f.dept || "—"})`).join(", ")}
              </div>
              <div><label style={labelStyle}>Teacher's Full Name *</label><input value={form.teacherName} onChange={e => update("teacherName", e.target.value)} placeholder="e.g. Dr. Kavitha Nair" style={inputStyle} /></div>
              <div><label style={labelStyle}>Teacher's Email (optional)</label><input value={form.teacherEmail} onChange={e => update("teacherEmail", e.target.value)} placeholder="e.g. kavitha@college.edu" style={inputStyle} /></div>
            </div>
          )}
          {step === 3 && (
            <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
              <div style={{ padding: "12px 16px", background: "#070a10", borderRadius: 10, border: "1px solid #1e2535", fontSize: 12, color: "#475569", lineHeight: 1.6 }}>📚 Separate multiple subjects with commas.</div>
              <div><label style={labelStyle}>Subject Names *</label><textarea value={form.subjectNames} onChange={e => update("subjectNames", e.target.value)} placeholder="e.g. Data Structures, Operating Systems, DBMS" rows={4} style={{ ...inputStyle, resize: "vertical" }} /></div>
              {form.subjectNames && (
                <div><label style={labelStyle}>Preview</label>
                  <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
                    {form.subjectNames.split(",").map(s => s.trim()).filter(Boolean).map((s, i) => (
                      <span key={i} style={{ padding: "5px 12px", background: "#1e2a4a", color: "#818cf8", borderRadius: 20, fontSize: 12, fontWeight: 600 }}>{s}</span>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}
          <div style={{ display: "flex", gap: 12, marginTop: 28 }}>
            {step > 0 && <button onClick={() => setStep(s => s - 1)} style={{ padding: "12px 20px", background: "#111520", border: "1px solid #1e2535", borderRadius: 10, color: "#64748b", fontSize: 14, fontWeight: 600, cursor: "pointer" }}>← Back</button>}
            <button onClick={handleNext} style={{ flex: 1, padding: "13px", background: "linear-gradient(135deg,#6366f1,#4f46e5)", border: "none", borderRadius: 10, color: "#fff", fontSize: 14, fontWeight: 700, cursor: "pointer" }}>
              {isLast ? "🚀 Complete Setup" : "Continue →"}
            </button>
          </div>
        </div>
        <p style={{ textAlign: "center", fontSize: 11, color: "#334155", marginTop: 16 }}>Step {step + 1} of {STUDENT_ONBOARDING_STEPS.length}</p>
      </div>
    </div>
  );
}

// ─── Registered Emails Modal ──────────────────────────────────────────────────
function RegisteredEmailsModal({ data, setData, onClose, currentUser, showToast }) {
  const [activeRole, setActiveRole] = useState("student");
  const [confirmDelete, setConfirmDelete] = useState(null);

  const canDelete = currentUser.role === "admin" || currentUser.role === "faculty";
  const roleUsers = data.users.filter(u => u.role === activeRole);
  const counts = { student: data.users.filter(u => u.role === "student").length, faculty: data.users.filter(u => u.role === "faculty").length, admin: data.users.filter(u => u.role === "admin").length };

  const handleDelete = (userId) => {
    if (currentUser.role === "faculty" && data.users.find(u => u.id === userId)?.role !== "student") {
      showToast("Faculty can only remove student emails.", "error");
      return;
    }
    if (userId === currentUser.id) { showToast("You cannot remove your own account.", "error"); return; }
    setData(prev => ({
      ...prev,
      users: prev.users.filter(u => u.id !== userId),
      auditLog: [...prev.auditLog, { id: "al" + Date.now(), action: "DELETE_USER", userId: currentUser.id, targetId: userId, detail: `Removed user: ${data.users.find(u => u.id === userId)?.email}`, time: new Date().toISOString() }],
    }));
    showToast("User removed successfully.");
    setConfirmDelete(null);
  };

  return (
    <div style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.85)", zIndex: 300, display: "flex", alignItems: "center", justifyContent: "center", padding: 20 }} onClick={onClose}>
      <div style={{ background: "#0d1018", border: "1px solid #1e2535", borderRadius: 20, width: "100%", maxWidth: 580, maxHeight: "80vh", display: "flex", flexDirection: "column", overflow: "hidden" }} onClick={e => e.stopPropagation()}>
        {/* Header */}
        <div style={{ padding: "20px 24px", borderBottom: "1px solid #1a2030", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <div>
            <h2 style={{ fontSize: 17, fontWeight: 800, color: "#fff" }}>📧 Registered Emails</h2>
            <p style={{ fontSize: 12, color: "#334155", marginTop: 2 }}>Total: {data.users.length} accounts</p>
          </div>
          <button onClick={onClose} style={{ background: "#111520", border: "1px solid #1a2030", borderRadius: 8, color: "#475569", padding: "6px 12px", cursor: "pointer", fontSize: 13 }}>✕</button>
        </div>

        {/* Role Tabs */}
        <div style={{ display: "flex", gap: 0, padding: "14px 24px", borderBottom: "1px solid #1a2030" }}>
          {[
            { key: "student", label: "Students", icon: "🎓", color: "#6366f1" },
            { key: "faculty", label: "Faculty", icon: "👩‍🏫", color: "#10b981" },
            { key: "admin", label: "Admins", icon: "⚙️", color: "#f59e0b" },
          ].map(r => (
            <button key={r.key} onClick={() => setActiveRole(r.key)} style={{
              flex: 1, padding: "10px 8px", background: activeRole === r.key ? "#151d30" : "transparent",
              border: `1px solid ${activeRole === r.key ? r.color + "44" : "#1a2030"}`,
              borderRadius: 10, color: activeRole === r.key ? r.color : "#334155",
              fontSize: 12, fontWeight: 700, cursor: "pointer", marginRight: 8,
              display: "flex", flexDirection: "column", alignItems: "center", gap: 2,
            }}>
              <span style={{ fontSize: 20 }}>{r.icon}</span>
              <span>{r.label}</span>
              <span style={{ fontSize: 18, fontWeight: 800, color: activeRole === r.key ? r.color : "#1e2a3a" }}>{counts[r.key]}</span>
            </button>
          ))}
        </div>

        {/* User List */}
        <div style={{ flex: 1, overflowY: "auto" }}>
          {roleUsers.length === 0 ? (
            <div style={{ padding: 40, textAlign: "center", color: "#334155", fontSize: 13 }}>No {activeRole}s registered yet.</div>
          ) : roleUsers.map((u, i) => (
            <div key={u.id} style={{ display: "flex", alignItems: "center", gap: 12, padding: "12px 24px", borderBottom: i < roleUsers.length - 1 ? "1px solid #111820" : "none", background: u.id === currentUser.id ? "#0f1628" : "transparent" }}>
              <div style={{ width: 36, height: 36, borderRadius: "50%", background: "linear-gradient(135deg,#6366f1,#10b981)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 11, fontWeight: 700, color: "#fff", flexShrink: 0 }}>{u.avatar}</div>
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                  <p style={{ fontSize: 13, fontWeight: 700, color: "#e2e8f0" }}>{u.name}</p>
                  {u.id === currentUser.id && <span style={{ fontSize: 9, background: "#1e2a4a", color: "#818cf8", padding: "2px 7px", borderRadius: 10, fontWeight: 700 }}>YOU</span>}
                  {!u.onboarded && <span style={{ fontSize: 9, background: "#f59e0b22", color: "#f59e0b", padding: "2px 7px", borderRadius: 10, fontWeight: 700 }}>SETUP PENDING</span>}
                </div>
                <p style={{ fontSize: 11, color: "#334155" }}>{u.email}</p>
                {u.rollNo && <p style={{ fontSize: 10, color: "#1e2a3a" }}>{u.rollNo} · {u.branch} · Year {u.year}</p>}
                {u.subjectsTaught && <p style={{ fontSize: 10, color: "#1e3a2a" }}>Teaches: {u.subjectsTaught}</p>}
              </div>
              {canDelete && u.id !== currentUser.id && (
                confirmDelete === u.id ? (
                  <div style={{ display: "flex", gap: 6 }}>
                    <button onClick={() => handleDelete(u.id)} style={{ padding: "5px 10px", background: "#ef444422", border: "1px solid #ef4444", borderRadius: 6, color: "#ef4444", fontSize: 11, fontWeight: 700, cursor: "pointer" }}>Confirm</button>
                    <button onClick={() => setConfirmDelete(null)} style={{ padding: "5px 10px", background: "#111520", border: "1px solid #1a2030", borderRadius: 6, color: "#475569", fontSize: 11, cursor: "pointer" }}>Cancel</button>
                  </div>
                ) : (
                  (currentUser.role === "admin" || (currentUser.role === "faculty" && u.role === "student")) && (
                    <button onClick={() => setConfirmDelete(u.id)} style={{ padding: "5px 10px", background: "#ef444415", border: "1px solid #ef444433", borderRadius: 6, color: "#ef4444", fontSize: 11, fontWeight: 700, cursor: "pointer" }}>🗑 Remove</button>
                  )
                )
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

// ─── Attendance Entry Modal ───────────────────────────────────────────────────
function AttendanceEntryModal({ data, setData, currentUser, onClose, showToast }) {
  const [mode, setMode] = useState("update"); // update | add
  const [selectedStudent, setSelectedStudent] = useState("");
  const [selectedSubject, setSelectedSubject] = useState("");
  const [totalClasses, setTotalClasses] = useState("");
  const [attended, setAttended] = useState("");
  const [newStudentName, setNewStudentName] = useState("");
  const [newStudentRollNo, setNewStudentRollNo] = useState("");
  const [newStudentBranch, setNewStudentBranch] = useState("CSE");
  const [newStudentYear, setNewStudentYear] = useState("1");

  // Faculty can only see their subjects
  const facultySubjects = currentUser.role === "faculty"
    ? data.subjects.filter(s => s.faculty === currentUser.id)
    : data.subjects;

  const students = data.users.filter(u => u.role === "student");

  const existingRecord = selectedStudent && selectedSubject
    ? data.attendance.find(a => a.studentId === selectedStudent && a.subjectId === selectedSubject)
    : null;

  // Auto-fill when record found
  const handleStudentChange = (sid) => {
    setSelectedStudent(sid);
    const rec = sid && selectedSubject ? data.attendance.find(a => a.studentId === sid && a.subjectId === selectedSubject) : null;
    if (rec) { setTotalClasses(rec.totalClasses); setAttended(rec.attended); }
    else { setTotalClasses(""); setAttended(""); }
  };
  const handleSubjectChange = (subId) => {
    setSelectedSubject(subId);
    const rec = selectedStudent && subId ? data.attendance.find(a => a.studentId === selectedStudent && a.subjectId === subId) : null;
    if (rec) { setTotalClasses(rec.totalClasses); setAttended(rec.attended); }
    else { setTotalClasses(""); setAttended(""); }
  };

  const handleSave = () => {
    if (!selectedSubject || !totalClasses || attended === "") { showToast("Please fill all fields.", "error"); return; }
    const tc = parseInt(totalClasses), att = parseInt(attended);
    if (att > tc) { showToast("Attended cannot exceed total classes.", "error"); return; }

    if (mode === "add") {
      if (!newStudentName || !newStudentRollNo) { showToast("Please enter student name and roll number.", "error"); return; }
      const existingUser = data.users.find(u => u.rollNo === newStudentRollNo);
      if (existingUser) { showToast("A student with this roll number already exists.", "error"); return; }

      const newUserId = "u" + Date.now();
      const newAttId = "a" + Date.now();
      setData(prev => ({
        ...prev,
        users: [...prev.users, { id: newUserId, name: newStudentName, email: `${newStudentRollNo.toLowerCase()}@college.edu`, password: "student123", role: "student", rollNo: newStudentRollNo, branch: newStudentBranch, year: parseInt(newStudentYear), avatar: initials(newStudentName), onboarded: true, course: "B.Tech", startYear: "2024", endYear: "2028", teacherName: currentUser.name, subjectNames: data.subjects.find(s => s.id === selectedSubject)?.name || "" }],
        attendance: [...prev.attendance, { id: newAttId, studentId: newUserId, subjectId: selectedSubject, totalClasses: tc, attended: att, adjusted: 0 }],
        auditLog: [...prev.auditLog, { id: "al" + Date.now(), action: "ADD_ATTENDANCE", userId: currentUser.id, targetId: newUserId, detail: `Added attendance for new student ${newStudentName} (${newStudentRollNo}) in ${data.subjects.find(s => s.id === selectedSubject)?.name}`, time: new Date().toISOString() }],
      }));
      showToast(`Student ${newStudentName} added with attendance!`);
    } else {
      if (!selectedStudent) { showToast("Please select a student.", "error"); return; }
      if (existingRecord) {
        setData(prev => ({
          ...prev,
          attendance: prev.attendance.map(a => a.studentId === selectedStudent && a.subjectId === selectedSubject ? { ...a, totalClasses: tc, attended: att } : a),
          auditLog: [...prev.auditLog, { id: "al" + Date.now(), action: "UPDATE_ATTENDANCE", userId: currentUser.id, targetId: selectedStudent, detail: `Updated attendance for ${students.find(s => s.id === selectedStudent)?.name} in ${data.subjects.find(s => s.id === selectedSubject)?.name}: ${att}/${tc}`, time: new Date().toISOString() }],
        }));
        showToast("Attendance updated!");
      } else {
        setData(prev => ({
          ...prev,
          attendance: [...prev.attendance, { id: "a" + Date.now(), studentId: selectedStudent, subjectId: selectedSubject, totalClasses: tc, attended: att, adjusted: 0 }],
          auditLog: [...prev.auditLog, { id: "al" + Date.now(), action: "ADD_ATTENDANCE", userId: currentUser.id, targetId: selectedStudent, detail: `Created attendance for ${students.find(s => s.id === selectedStudent)?.name} in ${data.subjects.find(s => s.id === selectedSubject)?.name}: ${att}/${tc}`, time: new Date().toISOString() }],
        }));
        showToast("Attendance record created!");
      }
    }
    onClose();
  };

  const inputStyle = { width: "100%", padding: "10px 14px", background: "#070a10", border: "1px solid #1e2535", borderRadius: 10, color: "#e2e8f0", fontSize: 13, outline: "none" };
  const labelStyle = { display: "block", fontSize: 10, fontWeight: 700, color: "#475569", marginBottom: 5, textTransform: "uppercase", letterSpacing: "0.8px" };

  return (
    <div style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.85)", zIndex: 300, display: "flex", alignItems: "center", justifyContent: "center", padding: 20 }} onClick={onClose}>
      <div style={{ background: "#0d1018", border: "1px solid #1e2535", borderRadius: 20, width: "100%", maxWidth: 500, overflow: "hidden" }} onClick={e => e.stopPropagation()}>
        <div style={{ padding: "20px 24px", borderBottom: "1px solid #1a2030", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <h2 style={{ fontSize: 17, fontWeight: 800, color: "#fff" }}>📝 Manage Attendance</h2>
          <button onClick={onClose} style={{ background: "#111520", border: "1px solid #1a2030", borderRadius: 8, color: "#475569", padding: "6px 12px", cursor: "pointer", fontSize: 13 }}>✕</button>
        </div>

        <div style={{ padding: 24, display: "flex", flexDirection: "column", gap: 16 }}>
          {/* Mode Toggle */}
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8 }}>
            {[{ v: "update", label: "📋 Existing Student", desc: "Update attendance" }, { v: "add", label: "➕ New Student", desc: "Add & set attendance" }].map(m => (
              <button key={m.v} onClick={() => setMode(m.v)} style={{
                padding: "10px", background: mode === m.v ? "#151d30" : "#0a0d14",
                border: `1px solid ${mode === m.v ? "#3b4fd8" : "#1a2030"}`,
                borderRadius: 10, color: mode === m.v ? "#818cf8" : "#334155",
                fontSize: 12, fontWeight: 700, cursor: "pointer", textAlign: "center",
              }}>
                <div>{m.label}</div>
                <div style={{ fontSize: 10, fontWeight: 400, color: mode === m.v ? "#6366f188" : "#1e2a3a", marginTop: 2 }}>{m.desc}</div>
              </button>
            ))}
          </div>

          {mode === "add" && (
            <>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
                <div><label style={labelStyle}>Student Name *</label><input value={newStudentName} onChange={e => setNewStudentName(e.target.value)} placeholder="Full name" style={inputStyle} /></div>
                <div><label style={labelStyle}>Roll Number *</label><input value={newStudentRollNo} onChange={e => setNewStudentRollNo(e.target.value)} placeholder="e.g. CS2024099" style={inputStyle} /></div>
                <div><label style={labelStyle}>Branch</label><select value={newStudentBranch} onChange={e => setNewStudentBranch(e.target.value)} style={inputStyle}>{["CSE","IT","ECE","EEE","ME","CE"].map(b => <option key={b}>{b}</option>)}</select></div>
                <div><label style={labelStyle}>Year</label><select value={newStudentYear} onChange={e => setNewStudentYear(e.target.value)} style={inputStyle}>{["1","2","3","4"].map(y => <option key={y}>{y}</option>)}</select></div>
              </div>
            </>
          )}

          {mode === "update" && (
            <div>
              <label style={labelStyle}>Select Student *</label>
              <select value={selectedStudent} onChange={e => handleStudentChange(e.target.value)} style={inputStyle}>
                <option value="">— Choose a student —</option>
                {students.map(s => <option key={s.id} value={s.id}>{s.name} ({s.rollNo})</option>)}
              </select>
            </div>
          )}

          <div>
            <label style={labelStyle}>Subject *</label>
            <select value={selectedSubject} onChange={e => handleSubjectChange(e.target.value)} style={inputStyle}>
              <option value="">— Choose a subject —</option>
              {facultySubjects.map(s => <option key={s.id} value={s.id}>{s.name} ({s.code})</option>)}
            </select>
          </div>

          {existingRecord && mode === "update" && (
            <div style={{ padding: "8px 14px", background: "#0a1f15", border: "1px solid #1e3a2a", borderRadius: 8, fontSize: 11, color: "#10b981" }}>
              ✓ Existing record found: {existingRecord.attended}/{existingRecord.totalClasses} classes ({pct(existingRecord.attended + existingRecord.adjusted, existingRecord.totalClasses)}%)
            </div>
          )}

          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
            <div><label style={labelStyle}>Total Classes *</label><input type="number" min={0} value={totalClasses} onChange={e => setTotalClasses(e.target.value)} placeholder="e.g. 45" style={inputStyle} /></div>
            <div><label style={labelStyle}>Classes Attended *</label><input type="number" min={0} value={attended} onChange={e => setAttended(e.target.value)} placeholder="e.g. 38" style={inputStyle} /></div>
          </div>

          {totalClasses && attended !== "" && (
            <div style={{ padding: "10px 14px", background: "#111520", borderRadius: 10, border: "1px solid #1a2030" }}>
              <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 6 }}>
                <span style={{ fontSize: 12, color: "#475569" }}>Attendance Preview</span>
                <span style={{ fontSize: 14, fontWeight: 800, color: pct(parseInt(attended), parseInt(totalClasses)) >= 75 ? "#10b981" : "#ef4444" }}>
                  {pct(parseInt(attended) || 0, parseInt(totalClasses) || 1)}%
                </span>
              </div>
              <div style={{ height: 5, background: "#1a2030", borderRadius: 3 }}>
                <div style={{ height: "100%", width: `${Math.min(100, pct(parseInt(attended) || 0, parseInt(totalClasses) || 1))}%`, background: pct(parseInt(attended) || 0, parseInt(totalClasses) || 1) >= 75 ? "#10b981" : "#ef4444", borderRadius: 3 }} />
              </div>
            </div>
          )}

          <button onClick={handleSave} style={{ padding: "12px", background: "linear-gradient(135deg,#6366f1,#4f46e5)", border: "none", borderRadius: 10, color: "#fff", fontSize: 14, fontWeight: 700, cursor: "pointer" }}>
            {mode === "add" ? "➕ Add Student & Attendance" : existingRecord ? "💾 Update Attendance" : "✓ Create Attendance Record"}
          </button>
        </div>
      </div>
    </div>
  );
}

// ─── Main App ─────────────────────────────────────────────────────────────────
export default function App() {
  const [currentUser, setCurrentUser] = useState(null);
  const [view, setView] = useState("login");
  const [data, setData] = useState(DB_INITIAL);
  const [toast, setToast] = useState(null);
  const [showEmailsModal, setShowEmailsModal] = useState(false);
  const [showAttendanceModal, setShowAttendanceModal] = useState(false);

  const showToast = (msg, type = "success") => {
    setToast({ msg, type });
    setTimeout(() => setToast(null), 3500);
  };

  const login = (email, password) => {
    const user = data.users.find(u => u.email === email && u.password === password);
    if (user) {
      setCurrentUser(user);
      if (!user.onboarded) {
        if (user.role === "student") setView("student-onboarding");
        else if (user.role === "faculty") setView("faculty-onboarding");
        else setView("admin-dashboard");
      } else {
        setView(user.role === "student" ? "student-dashboard" : user.role === "faculty" ? "faculty-dashboard" : "admin-dashboard");
        showToast(`Welcome back, ${user.name.split(" ")[0]}!`);
      }
    } else {
      showToast("Invalid credentials. Please try again.", "error");
    }
  };

  const signup = (name, email, password, role) => {
    if (data.users.find(u => u.email === email)) { showToast("An account with this email already exists.", "error"); return false; }
    const newUser = { id: "u" + Date.now(), name, email, password, role, avatar: initials(name), onboarded: false, ...(role === "faculty" ? { dept: "CSE" } : {}) };
    setData(prev => ({
      ...prev, users: [...prev.users, newUser],
      auditLog: [...prev.auditLog, { id: "al" + Date.now(), action: "SIGNUP", userId: newUser.id, targetId: newUser.id, detail: `New account: ${name} (${role})`, time: new Date().toISOString() }],
    }));
    setCurrentUser(newUser);
    if (role === "student") { setView("student-onboarding"); showToast("Account created! Set up your profile."); }
    else if (role === "faculty") { setView("faculty-onboarding"); showToast("Account created! Set up your faculty profile."); }
    else { setData(prev => ({ ...prev, users: prev.users.map(u => u.id === newUser.id ? { ...u, onboarded: true } : u) })); setView("admin-dashboard"); showToast(`Welcome, ${name.split(" ")[0]}!`); }
    return true;
  };

  const logout = () => { setCurrentUser(null); setView("login"); };

  const approveSubmission = (subId, note, reviewerId) => {
    const sub = data.submissions.find(s => s.id === subId);
    if (!sub) return;
    setData(prev => ({
      ...prev,
      submissions: prev.submissions.map(s => s.id === subId ? { ...s, status: "approved", reviewedBy: reviewerId, reviewNote: note, reviewedAt: new Date().toISOString() } : s),
      attendance: prev.attendance.map(a => {
        if (a.studentId === sub.studentId && sub.subjects.includes(a.subjectId)) return { ...a, adjusted: a.adjusted + sub.missedClasses };
        return a;
      }),
      notifications: [...prev.notifications, { id: "n" + Date.now(), userId: sub.studentId, message: `"${sub.title}" has been approved! Attendance updated.`, type: "success", read: false, time: new Date().toISOString() }],
      auditLog: [...prev.auditLog, { id: "al" + Date.now(), action: "APPROVE", userId: reviewerId, targetId: subId, detail: `Approved "${sub.title}"`, time: new Date().toISOString() }],
    }));
    showToast("Submission approved & attendance updated!");
  };

  const rejectSubmission = (subId, note, reviewerId) => {
    const sub = data.submissions.find(s => s.id === subId);
    if (!sub) return;
    setData(prev => ({
      ...prev,
      submissions: prev.submissions.map(s => s.id === subId ? { ...s, status: "rejected", reviewedBy: reviewerId, reviewNote: note, reviewedAt: new Date().toISOString() } : s),
      notifications: [...prev.notifications, { id: "n" + Date.now(), userId: sub.studentId, message: `"${sub.title}" was rejected. Reason: ${note}`, type: "error", read: false, time: new Date().toISOString() }],
      auditLog: [...prev.auditLog, { id: "al" + Date.now(), action: "REJECT", userId: reviewerId, targetId: subId, detail: `Rejected "${sub.title}": ${note}`, time: new Date().toISOString() }],
    }));
    showToast("Submission rejected.", "error");
  };

  const addSubmission = (formData, studentId) => {
    const newSub = { id: "sub" + Date.now(), studentId, ...formData, status: "pending", reviewedBy: null, reviewNote: null, submittedAt: new Date().toISOString(), reviewedAt: null };
    setData(prev => ({
      ...prev, submissions: [...prev.submissions, newSub],
      auditLog: [...prev.auditLog, { id: "al" + Date.now(), action: "SUBMIT", userId: studentId, targetId: newSub.id, detail: `New submission: ${formData.title}`, time: new Date().toISOString() }],
    }));
    showToast("Submission uploaded successfully!");
  };

  const markNotifRead = (nid) => setData(prev => ({ ...prev, notifications: prev.notifications.map(n => n.id === nid ? { ...n, read: true } : n) }));

  const ctx = { currentUser, data, setData, login, logout, approveSubmission, rejectSubmission, addSubmission, markNotifRead, showToast, setShowEmailsModal, setShowAttendanceModal };

  return (
    <div style={{ fontFamily: "'Sora', 'DM Sans', sans-serif", minHeight: "100vh", background: "#070a10", color: "#e2e8f0" }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Sora:wght@300;400;500;600;700;800&family=DM+Sans:ital,opsz,wght@0,9..40,400;0,9..40,500;0,9..40,600;1,9..40,400&family=JetBrains+Mono:wght@400;500&display=swap');
        * { box-sizing: border-box; margin: 0; padding: 0; }
        ::-webkit-scrollbar { width: 5px; } ::-webkit-scrollbar-track { background: #070a10; } ::-webkit-scrollbar-thumb { background: #1e2535; border-radius: 3px; }
        input, select, textarea { font-family: 'DM Sans', sans-serif; }
        @keyframes fadeUp { from { opacity:0; transform: translateY(18px); } to { opacity:1; transform: translateY(0); } }
        @keyframes slideIn { from { transform: translateX(110%); opacity:0; } to { transform: translateX(0); opacity:1; } }
        @keyframes spin { to { transform: rotate(360deg); } }
        @keyframes glow { 0%,100% { box-shadow: 0 0 20px rgba(99,102,241,0.2); } 50% { box-shadow: 0 0 35px rgba(99,102,241,0.4); } }
        .fadeUp { animation: fadeUp 0.45s cubic-bezier(0.22,1,0.36,1) forwards; }
        .card { background: #0d1018; border: 1px solid #1a2030; border-radius: 16px; transition: border-color 0.2s; }
        .card:hover { border-color: #252d42; }
        .btn { cursor: pointer; border: none; border-radius: 10px; font-family: 'Sora', sans-serif; font-weight: 600; transition: all 0.18s; }
        .btn:active { transform: scale(0.97); }
        .btn:hover { filter: brightness(1.1); }
        .tag { display:inline-flex; align-items:center; gap:4px; padding:3px 10px; border-radius:20px; font-size:11px; font-weight:700; letter-spacing:0.4px; }
        input:focus, select:focus, textarea:focus { border-color: #3b4fd8 !important; box-shadow: 0 0 0 3px rgba(99,102,241,0.12); }
      `}</style>

      {toast && (
        <div style={{ position: "fixed", top: 20, right: 20, zIndex: 9999, background: toast.type === "success" ? "#10b981" : toast.type === "error" ? "#ef4444" : "#6366f1", color: "#fff", padding: "13px 20px", borderRadius: 12, fontWeight: 600, fontSize: 13, boxShadow: "0 8px 32px rgba(0,0,0,0.5)", animation: "slideIn 0.3s cubic-bezier(0.22,1,0.36,1)", maxWidth: 340, display: "flex", alignItems: "center", gap: 10 }}>
          <span style={{ fontSize: 16 }}>{toast.type === "success" ? "✓" : toast.type === "error" ? "✕" : "ℹ"}</span>
          {toast.msg}
        </div>
      )}

      {showEmailsModal && currentUser && (
        <RegisteredEmailsModal data={data} setData={setData} onClose={() => setShowEmailsModal(false)} currentUser={currentUser} showToast={showToast} />
      )}
      {showAttendanceModal && currentUser && (
        <AttendanceEntryModal data={data} setData={setData} currentUser={currentUser} onClose={() => setShowAttendanceModal(false)} showToast={showToast} />
      )}

      {view === "login" && <LoginPage ctx={ctx} goSignup={() => setView("signup")} />}
      {view === "signup" && <SignupPage ctx={ctx} signup={signup} goLogin={() => setView("login")} />}
      {view === "student-onboarding" && currentUser && <StudentOnboardingFlow user={currentUser} data={data} setData={setData} onComplete={u => { setCurrentUser(u); setView("student-dashboard"); }} showToast={showToast} />}
      {view === "faculty-onboarding" && currentUser && <FacultyOnboardingFlow user={currentUser} data={data} setData={setData} onComplete={u => { setCurrentUser(u); setView("faculty-dashboard"); }} showToast={showToast} />}
      {view === "student-dashboard" && <StudentDashboard ctx={ctx} />}
      {view === "faculty-dashboard" && <FacultyDashboard ctx={ctx} />}
      {view === "admin-dashboard" && <AdminDashboard ctx={ctx} />}
    </div>
  );
}

// ─── Login Page ───────────────────────────────────────────────────────────────
function LoginPage({ ctx, goSignup }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState("student");
  const demos = { student: { email: "arjun@college.edu", password: "student123" }, faculty: { email: "kavitha@college.edu", password: "faculty123" }, admin: { email: "admin@college.edu", password: "admin123" } };
  const fillDemo = (r) => { setRole(r); setEmail(demos[r].email); setPassword(demos[r].password); };

  return (
    <div style={{ minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center", padding: 20, position: "relative", overflow: "hidden", background: "#070a10" }}>
      <div style={{ position: "absolute", inset: 0, background: "radial-gradient(ellipse 80% 60% at 50% -10%, #0f2040 0%, transparent 70%)" }} />
      <div style={{ position: "absolute", top: "15%", left: "8%", width: 320, height: 320, borderRadius: "50%", background: "radial-gradient(circle, rgba(99,102,241,0.1) 0%, transparent 70%)" }} />
      <div className="fadeUp" style={{ width: "100%", maxWidth: 420, position: "relative", zIndex: 2 }}>
        <div style={{ textAlign: "center", marginBottom: 32 }}>
          <div style={{ display: "inline-flex", alignItems: "center", justifyContent: "center", width: 60, height: 60, borderRadius: 18, background: "linear-gradient(135deg, #6366f1, #10b981)", marginBottom: 14, fontSize: 26, animation: "glow 3s ease infinite" }}>📋</div>
          <h1 style={{ fontSize: 25, fontWeight: 800, color: "#fff", letterSpacing: "-0.5px" }}>SmartAttend</h1>
          <p style={{ color: "#475569", fontSize: 13, marginTop: 4 }}>Intelligent Attendance Management</p>
        </div>
        <div className="card" style={{ padding: 30 }}>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 6, marginBottom: 26, padding: 4, background: "#070a10", borderRadius: 12 }}>
            {["student", "faculty", "admin"].map(r => (
              <button key={r} onClick={() => fillDemo(r)} className="btn" style={{ padding: "8px 0", fontSize: 12, fontWeight: role === r ? 700 : 500, background: role === r ? "#1a2440" : "transparent", color: role === r ? "#818cf8" : "#475569", border: role === r ? "1px solid #2e3f6e" : "1px solid transparent", borderRadius: 8, textTransform: "capitalize" }}>{r === "faculty" ? "Faculty" : r.charAt(0).toUpperCase() + r.slice(1)}</button>
            ))}
          </div>
          <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
            <div>
              <label style={{ display: "block", fontSize: 11, fontWeight: 700, color: "#475569", marginBottom: 6, letterSpacing: "0.8px", textTransform: "uppercase" }}>Email</label>
              <input value={email} onChange={e => setEmail(e.target.value)} placeholder="Enter your email" style={{ width: "100%", padding: "12px 14px", background: "#070a10", border: "1px solid #1e2535", borderRadius: 10, color: "#e2e8f0", fontSize: 14, outline: "none" }} />
            </div>
            <div>
              <label style={{ display: "block", fontSize: 11, fontWeight: 700, color: "#475569", marginBottom: 6, letterSpacing: "0.8px", textTransform: "uppercase" }}>Password</label>
              <input type="password" value={password} onChange={e => setPassword(e.target.value)} placeholder="Enter your password" onKeyDown={e => e.key === "Enter" && ctx.login(email, password)} style={{ width: "100%", padding: "12px 14px", background: "#070a10", border: "1px solid #1e2535", borderRadius: 10, color: "#e2e8f0", fontSize: 14, outline: "none" }} />
            </div>
            <button onClick={() => ctx.login(email, password)} className="btn" style={{ padding: "13px", background: "linear-gradient(135deg, #6366f1, #4f46e5)", color: "#fff", fontSize: 14, marginTop: 4, fontWeight: 700 }}>Sign In →</button>
            <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
              <div style={{ flex: 1, height: 1, background: "#1a2030" }} />
              <span style={{ fontSize: 11, color: "#334155", fontWeight: 600 }}>OR</span>
              <div style={{ flex: 1, height: 1, background: "#1a2030" }} />
            </div>
            <button onClick={goSignup} className="btn" style={{ padding: "12px", background: "transparent", border: "1px solid #1e2535", color: "#818cf8", fontSize: 14, fontWeight: 600, display: "flex", alignItems: "center", justifyContent: "center", gap: 8 }}>✨ Create New Account</button>
          </div>
          <div style={{ marginTop: 18, padding: 14, background: "#070a10", borderRadius: 10, border: "1px solid #1a2030" }}>
            <p style={{ fontSize: 10, color: "#334155", fontWeight: 700, marginBottom: 6, textTransform: "uppercase", letterSpacing: "0.8px" }}>Demo Credentials</p>
            {Object.entries(demos).map(([r, creds]) => (
              <div key={r} onClick={() => fillDemo(r)} style={{ cursor: "pointer", padding: "4px 0", display: "flex", justifyContent: "space-between" }}>
                <span style={{ fontSize: 12, color: "#475569", textTransform: "capitalize" }}>{r}</span>
                <span style={{ fontSize: 11, color: "#2d3a50", fontFamily: "JetBrains Mono, monospace" }}>{creds.email}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

// ─── Signup Page ──────────────────────────────────────────────────────────────
function SignupPage({ ctx, signup, goLogin }) {
  const [form, setForm] = useState({ name: "", email: "", password: "", confirmPassword: "", role: "student" });
  const [loading, setLoading] = useState(false);
  const [showPass, setShowPass] = useState(false);
  const update = (k, v) => setForm(f => ({ ...f, [k]: v }));

  const handleSignup = async () => {
    if (!form.name || !form.email || !form.password) { ctx.showToast("Please fill all fields.", "error"); return; }
    if (form.password !== form.confirmPassword) { ctx.showToast("Passwords do not match.", "error"); return; }
    if (form.password.length < 6) { ctx.showToast("Password must be at least 6 characters.", "error"); return; }
    if (!form.email.includes("@")) { ctx.showToast("Please enter a valid email.", "error"); return; }
    setLoading(true);
    await new Promise(r => setTimeout(r, 800));
    signup(form.name, form.email, form.password, form.role);
    setLoading(false);
  };

  const inputStyle = { width: "100%", padding: "12px 14px", background: "#070a10", border: "1px solid #1e2535", borderRadius: 10, color: "#e2e8f0", fontSize: 14, outline: "none" };
  const labelStyle = { display: "block", fontSize: 11, fontWeight: 700, color: "#475569", marginBottom: 6, letterSpacing: "0.8px", textTransform: "uppercase" };

  return (
    <div style={{ minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center", padding: 20, background: "#070a10", position: "relative", overflow: "hidden" }}>
      <div style={{ position: "absolute", inset: 0, background: "radial-gradient(ellipse 80% 60% at 30% -10%, #0f2040 0%, transparent 60%)" }} />
      <div className="fadeUp" style={{ width: "100%", maxWidth: 440, position: "relative", zIndex: 2 }}>
        <div style={{ textAlign: "center", marginBottom: 28 }}>
          <div style={{ display: "inline-flex", alignItems: "center", justifyContent: "center", width: 56, height: 56, borderRadius: 16, background: "linear-gradient(135deg, #6366f1, #10b981)", marginBottom: 14, fontSize: 24 }}>✨</div>
          <h1 style={{ fontSize: 23, fontWeight: 800, color: "#fff" }}>Create Account</h1>
          <p style={{ color: "#475569", fontSize: 13, marginTop: 4 }}>Join SmartAttend today</p>
        </div>
        <div className="card" style={{ padding: 30 }}>
          <div style={{ marginBottom: 20 }}>
            <label style={labelStyle}>I am a</label>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 8 }}>
              {[{ val: "student", icon: "🎓", label: "Student" }, { val: "faculty", icon: "👩‍🏫", label: "Faculty" }, { val: "admin", icon: "⚙️", label: "Admin" }].map(r => (
                <button key={r.val} onClick={() => update("role", r.val)} className="btn" style={{ padding: "10px 8px", fontSize: 12, fontWeight: 700, background: form.role === r.val ? "#1a2440" : "#0d1018", color: form.role === r.val ? "#818cf8" : "#475569", border: `1px solid ${form.role === r.val ? "#3b4fd8" : "#1a2030"}`, borderRadius: 10, display: "flex", flexDirection: "column", alignItems: "center", gap: 4 }}>
                  <span style={{ fontSize: 18 }}>{r.icon}</span>{r.label}
                </button>
              ))}
            </div>
            {form.role === "faculty" && <p style={{ fontSize: 11, color: "#475569", marginTop: 8, padding: "6px 10px", background: "#0d1018", borderRadius: 8 }}>👩‍🏫 After signup, you'll specify which subjects you teach to auto-connect with your students.</p>}
            {form.role === "student" && <p style={{ fontSize: 11, color: "#475569", marginTop: 8, padding: "6px 10px", background: "#0d1018", borderRadius: 8 }}>📋 After signup, you'll fill in your academic profile to connect with your teacher.</p>}
          </div>
          <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
            <div><label style={labelStyle}>Full Name *</label><input value={form.name} onChange={e => update("name", e.target.value)} placeholder="Enter your full name" style={inputStyle} /></div>
            <div><label style={labelStyle}>Email Address *</label><input type="email" value={form.email} onChange={e => update("email", e.target.value)} placeholder="you@college.edu" style={inputStyle} /></div>
            <div>
              <label style={labelStyle}>Password *</label>
              <div style={{ position: "relative" }}>
                <input type={showPass ? "text" : "password"} value={form.password} onChange={e => update("password", e.target.value)} placeholder="Min. 6 characters" style={{ ...inputStyle, paddingRight: 44 }} />
                <button onClick={() => setShowPass(!showPass)} style={{ position: "absolute", right: 12, top: "50%", transform: "translateY(-50%)", background: "none", border: "none", cursor: "pointer", color: "#475569", fontSize: 14 }}>{showPass ? "🙈" : "👁"}</button>
              </div>
            </div>
            <div>
              <label style={labelStyle}>Confirm Password *</label>
              <input type="password" value={form.confirmPassword} onChange={e => update("confirmPassword", e.target.value)} onKeyDown={e => e.key === "Enter" && handleSignup()} placeholder="Re-enter your password" style={{ ...inputStyle, borderColor: form.confirmPassword && form.password !== form.confirmPassword ? "#ef4444" : "#1e2535" }} />
              {form.confirmPassword && form.password !== form.confirmPassword && <p style={{ fontSize: 11, color: "#ef4444", marginTop: 4 }}>Passwords don't match</p>}
            </div>
            <button onClick={handleSignup} disabled={loading} className="btn" style={{ padding: "13px", background: loading ? "#1e2535" : "linear-gradient(135deg,#10b981,#059669)", color: loading ? "#475569" : "#fff", fontSize: 14, fontWeight: 700, marginTop: 4, display: "flex", alignItems: "center", justifyContent: "center", gap: 8 }}>
              {loading ? <><span style={{ animation: "spin 1s linear infinite", display: "inline-block" }}>⏳</span> Creating Account...</> : "Create Account →"}
            </button>
          </div>
          <button onClick={goLogin} style={{ display: "block", width: "100%", marginTop: 16, padding: "10px", background: "none", border: "none", color: "#475569", fontSize: 13, cursor: "pointer", textAlign: "center" }}>
            Already have an account? <span style={{ color: "#818cf8", fontWeight: 600 }}>Sign In</span>
          </button>
        </div>
      </div>
    </div>
  );
}

// ─── Shared Nav ───────────────────────────────────────────────────────────────
function Nav({ ctx, tabs, activeTab, setActiveTab }) {
  const { currentUser, data, logout, markNotifRead, setShowEmailsModal, setShowAttendanceModal } = ctx;
  const [showNotif, setShowNotif] = useState(false);
  const userNotifs = data.notifications.filter(n => n.userId === currentUser.id);
  const unread = userNotifs.filter(n => !n.read).length;

  return (
    <nav style={{ background: "#0a0d14", borderBottom: "1px solid #1a2030", padding: "0 20px", display: "flex", alignItems: "center", gap: 0, height: 58, position: "sticky", top: 0, zIndex: 100, flexWrap: "wrap" }}>
      <div style={{ display: "flex", alignItems: "center", gap: 10, marginRight: 20 }}>
        <div style={{ width: 30, height: 30, borderRadius: 9, background: "linear-gradient(135deg, #6366f1, #10b981)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 14 }}>📋</div>
        <span style={{ fontWeight: 800, fontSize: 14, color: "#fff" }}>SmartAttend</span>
      </div>
      <div style={{ display: "flex", gap: 2, flex: 1, flexWrap: "wrap" }}>
        {tabs.map(t => (
          <button key={t.id} onClick={() => setActiveTab(t.id)} className="btn" style={{ padding: "7px 12px", fontSize: 12, fontWeight: activeTab === t.id ? 700 : 500, background: activeTab === t.id ? "#151d30" : "transparent", color: activeTab === t.id ? "#818cf8" : "#475569", borderRadius: 8 }}>{t.icon} {t.label}</button>
        ))}
      </div>
      <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
        {/* Registered Emails Button */}
        <button onClick={() => setShowEmailsModal(true)} className="btn" style={{ padding: "6px 11px", background: "#111520", color: "#475569", fontSize: 11, border: "1px solid #1a2030", display: "flex", alignItems: "center", gap: 5 }}>
          📧 <span style={{ display: "none", "@media(min-width:768px)": { display: "inline" } }}>{data.users.length} Users</span>
          <span>{data.users.length}</span>
        </button>
        {/* Attendance Button for faculty/admin */}
        {(currentUser.role === "faculty" || currentUser.role === "admin") && (
          <button onClick={() => setShowAttendanceModal(true)} className="btn" style={{ padding: "6px 11px", background: "#0a1a10", color: "#10b981", fontSize: 11, border: "1px solid #1e3a2a", display: "flex", alignItems: "center", gap: 5 }}>
            ✏️ Attendance
          </button>
        )}
        <div style={{ position: "relative" }}>
          <button onClick={() => setShowNotif(!showNotif)} className="btn" style={{ padding: "7px 11px", background: "#111520", color: "#94a3b8", fontSize: 15, position: "relative" }}>
            🔔{unread > 0 && <span style={{ position: "absolute", top: 4, right: 4, width: 7, height: 7, borderRadius: "50%", background: "#ef4444", border: "2px solid #0a0d14" }} />}
          </button>
          {showNotif && (
            <div className="card fadeUp" style={{ position: "absolute", right: 0, top: 42, width: 300, zIndex: 200, maxHeight: 340, overflowY: "auto" }}>
              <div style={{ padding: "12px 16px", borderBottom: "1px solid #1a2030", fontWeight: 700, fontSize: 13, color: "#fff", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <span>Notifications</span>
                {unread > 0 && <span style={{ fontSize: 10, color: "#ef4444", background: "#ef444422", padding: "2px 8px", borderRadius: 10, fontWeight: 700 }}>{unread} new</span>}
              </div>
              {userNotifs.length === 0 ? <p style={{ padding: 16, color: "#334155", fontSize: 13 }}>No notifications</p> :
                userNotifs.slice().reverse().map(n => (
                  <div key={n.id} onClick={() => markNotifRead(n.id)} style={{ padding: "12px 16px", borderBottom: "1px solid #111820", cursor: "pointer", background: n.read ? "transparent" : "#0f1628" }}>
                    <div style={{ display: "flex", gap: 8, alignItems: "flex-start" }}>
                      <span style={{ fontSize: 15 }}>{n.type === "success" ? "✅" : n.type === "error" ? "❌" : "ℹ️"}</span>
                      <div>
                        <p style={{ fontSize: 12, color: n.read ? "#334155" : "#cbd5e1", lineHeight: 1.5 }}>{n.message}</p>
                        <p style={{ fontSize: 10, color: "#1e2a3a", marginTop: 4 }}>{fmtDate(n.time)} {fmtTime(n.time)}</p>
                      </div>
                    </div>
                  </div>
                ))}
            </div>
          )}
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
          <div style={{ width: 32, height: 32, borderRadius: "50%", background: "linear-gradient(135deg, #6366f1, #10b981)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 11, fontWeight: 700, color: "#fff" }}>{currentUser.avatar}</div>
          <div>
            <p style={{ fontSize: 12, fontWeight: 700, color: "#e2e8f0" }}>{currentUser.name.split(" ")[0]}</p>
            <p style={{ fontSize: 10, color: "#334155", textTransform: "capitalize" }}>{currentUser.role}</p>
          </div>
        </div>
        <button onClick={logout} className="btn" style={{ padding: "7px 12px", background: "#111520", color: "#475569", fontSize: 11, border: "1px solid #1a2030" }}>Logout</button>
      </div>
    </nav>
  );
}

// ─── Student Dashboard ────────────────────────────────────────────────────────
function StudentDashboard({ ctx }) {
  const [tab, setTab] = useState("overview");
  const tabs = [{ id: "overview", label: "Overview", icon: "📊" }, { id: "attendance", label: "Attendance", icon: "📅" }, { id: "submissions", label: "My Submissions", icon: "📁" }, { id: "upload", label: "New Request", icon: "⬆️" }];
  return (
    <div>
      <Nav ctx={ctx} tabs={tabs} activeTab={tab} setActiveTab={setTab} />
      <div style={{ padding: "28px", maxWidth: 1100, margin: "0 auto" }}>
        {tab === "overview" && <StudentOverview ctx={ctx} />}
        {tab === "attendance" && <StudentAttendance ctx={ctx} />}
        {tab === "submissions" && <StudentSubmissions ctx={ctx} />}
        {tab === "upload" && <UploadForm ctx={ctx} onSuccess={() => setTab("submissions")} />}
      </div>
    </div>
  );
}

function StudentOverview({ ctx }) {
  const { currentUser, data } = ctx;
  const att = getStudentAttendance(currentUser.id, data);
  const subs = data.submissions.filter(s => s.studentId === currentUser.id);
  const low = att.filter(a => a.pct < 75).length;
  const avgPct = att.length > 0 ? Math.round(att.reduce((s, a) => s + a.pct, 0) / att.length) : 0;

  return (
    <div className="fadeUp">
      <div style={{ marginBottom: 26 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
          <div style={{ width: 48, height: 48, borderRadius: "50%", background: "linear-gradient(135deg,#6366f1,#10b981)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 16, fontWeight: 800, color: "#fff" }}>{currentUser.avatar}</div>
          <div>
            <h2 style={{ fontSize: 20, fontWeight: 800, color: "#fff" }}>Welcome back, {currentUser.name.split(" ")[0]} 👋</h2>
            <p style={{ color: "#334155", fontSize: 13, marginTop: 2 }}>{currentUser.rollNo} · {currentUser.branch} · Year {currentUser.year} · {currentUser.course}</p>
          </div>
        </div>
        {currentUser.teacherName && (
          <div style={{ marginTop: 12, padding: "8px 14px", background: "#0d1018", border: "1px solid #1a2030", borderRadius: 10, display: "inline-flex", alignItems: "center", gap: 8, fontSize: 12, color: "#475569" }}>
            👩‍🏫 <span>Teacher: <strong style={{ color: "#818cf8" }}>{currentUser.teacherName}</strong></span>
          </div>
        )}
      </div>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(4,1fr)", gap: 14, marginBottom: 22 }}>
        {[
          { label: "Avg Attendance", value: `${avgPct}%`, color: avgPct >= 75 ? "#10b981" : "#ef4444", icon: "📊" },
          { label: "Subjects", value: att.length, color: "#6366f1", icon: "📚" },
          { label: "Low Attendance", value: low, color: low > 0 ? "#ef4444" : "#10b981", icon: "⚠️" },
          { label: "Total Requests", value: subs.length, color: "#f59e0b", icon: "📁" },
        ].map(s => (
          <div key={s.label} className="card" style={{ padding: 18 }}>
            <div style={{ fontSize: 22, marginBottom: 8 }}>{s.icon}</div>
            <div style={{ fontSize: 26, fontWeight: 800, color: s.color }}>{s.value}</div>
            <div style={{ fontSize: 11, color: "#334155", fontWeight: 600, marginTop: 4 }}>{s.label}</div>
          </div>
        ))}
      </div>
      <div style={{ display: "grid", gridTemplateColumns: "1.4fr 1fr", gap: 18 }}>
        <div className="card" style={{ padding: 22 }}>
          <h3 style={{ fontSize: 14, fontWeight: 700, color: "#94a3b8", marginBottom: 16 }}>Attendance by Subject</h3>
          {att.length === 0 ? (
            <div style={{ padding: "20px 0", textAlign: "center", color: "#334155", fontSize: 13 }}>
              <div style={{ fontSize: 28, marginBottom: 8 }}>📚</div>No subjects linked yet.
            </div>
          ) : att.map(a => (
            <div key={a.id} style={{ marginBottom: 14 }}>
              <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 5 }}>
                <span style={{ fontSize: 13, color: "#94a3b8", fontWeight: 500 }}>{a.subject?.name}</span>
                <span style={{ fontSize: 13, fontWeight: 700, color: a.pct >= 75 ? "#10b981" : "#ef4444" }}>{a.pct}%</span>
              </div>
              <div style={{ height: 5, background: "#1a2030", borderRadius: 3, overflow: "hidden" }}>
                <div style={{ height: "100%", width: `${a.pct}%`, background: a.pct >= 75 ? "linear-gradient(90deg,#10b981,#059669)" : "linear-gradient(90deg,#ef4444,#dc2626)", borderRadius: 3 }} />
              </div>
              <div style={{ display: "flex", gap: 10, marginTop: 3 }}>
                <span style={{ fontSize: 10, color: "#1e2a3a" }}>{a.adjAtt}/{a.totalClasses} classes</span>
                {a.adjusted > 0 && <span style={{ fontSize: 10, color: "#6366f1" }}>+{a.adjusted} compensated</span>}
              </div>
            </div>
          ))}
        </div>
        <div className="card" style={{ padding: 22 }}>
          <h3 style={{ fontSize: 14, fontWeight: 700, color: "#94a3b8", marginBottom: 16 }}>Recent Submissions</h3>
          {subs.length === 0 ? <p style={{ color: "#1e2a3a", fontSize: 13 }}>No submissions yet.</p> :
            subs.slice(-4).reverse().map(s => (
              <div key={s.id} style={{ display: "flex", alignItems: "center", gap: 10, padding: "9px 0", borderBottom: "1px solid #111820" }}>
                <span style={{ fontSize: 18 }}>{typeIcons[s.type]}</span>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <p style={{ fontSize: 12, color: "#cbd5e1", fontWeight: 600, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{s.title}</p>
                  <p style={{ fontSize: 10, color: "#1e2a3a" }}>{fmtDate(s.submittedAt)}</p>
                </div>
                <span className="tag" style={{ background: statusColors[s.status] + "22", color: statusColors[s.status] }}>{s.status}</span>
              </div>
            ))}
        </div>
      </div>
    </div>
  );
}

function StudentAttendance({ ctx }) {
  const att = getStudentAttendance(ctx.currentUser.id, ctx.data);
  return (
    <div className="fadeUp">
      <h2 style={{ fontSize: 20, fontWeight: 800, color: "#fff", marginBottom: 20 }}>Attendance Records</h2>
      {att.length === 0 ? (
        <div className="card" style={{ padding: 40, textAlign: "center" }}>
          <div style={{ fontSize: 36, marginBottom: 12 }}>📚</div>
          <p style={{ color: "#334155", fontSize: 14 }}>No attendance records yet.</p>
        </div>
      ) : (
        <div style={{ display: "grid", gap: 14 }}>
          {att.map(a => {
            const needed = a.totalClasses * 0.75;
            const deficit = Math.max(0, Math.ceil(needed - a.adjAtt));
            return (
              <div key={a.id} className="card" style={{ padding: 22 }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 14 }}>
                  <div>
                    <h3 style={{ fontSize: 16, fontWeight: 700, color: "#e2e8f0" }}>{a.subject?.name}</h3>
                    <p style={{ fontSize: 12, color: "#334155" }}>{a.subject?.code} · Faculty: {ctx.data.users.find(u => u.id === a.subject?.faculty)?.name}</p>
                  </div>
                  <div style={{ textAlign: "right" }}>
                    <div style={{ fontSize: 30, fontWeight: 800, color: a.pct >= 75 ? "#10b981" : "#ef4444", lineHeight: 1 }}>{a.pct}%</div>
                    <div style={{ fontSize: 10, color: "#334155", marginTop: 2 }}>Attendance</div>
                  </div>
                </div>
                <div style={{ height: 7, background: "#1a2030", borderRadius: 4, marginBottom: 12, overflow: "hidden" }}>
                  <div style={{ height: "100%", width: `${a.pct}%`, background: a.pct >= 75 ? "linear-gradient(90deg,#10b981,#059669)" : "linear-gradient(90deg,#ef4444,#dc2626)", borderRadius: 4 }} />
                </div>
                <div style={{ display: "flex", gap: 20 }}>
                  <div style={{ textAlign: "center" }}><div style={{ fontSize: 18, fontWeight: 700, color: "#fff" }}>{a.adjAtt}</div><div style={{ fontSize: 11, color: "#334155" }}>Attended</div></div>
                  <div style={{ textAlign: "center" }}><div style={{ fontSize: 18, fontWeight: 700, color: "#fff" }}>{a.totalClasses}</div><div style={{ fontSize: 11, color: "#334155" }}>Total</div></div>
                  {a.adjusted > 0 && <div style={{ textAlign: "center" }}><div style={{ fontSize: 18, fontWeight: 700, color: "#6366f1" }}>+{a.adjusted}</div><div style={{ fontSize: 11, color: "#334155" }}>Compensated</div></div>}
                  {deficit > 0 && <div style={{ textAlign: "center" }}><div style={{ fontSize: 18, fontWeight: 700, color: "#ef4444" }}>{deficit}</div><div style={{ fontSize: 11, color: "#334155" }}>Classes Needed</div></div>}
                  {a.pct >= 75 ? <span className="tag" style={{ background: "#10b98122", color: "#10b981", alignSelf: "center" }}>✓ Safe</span> : <span className="tag" style={{ background: "#ef444422", color: "#ef4444", alignSelf: "center" }}>⚠ Below 75%</span>}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}

function StudentSubmissions({ ctx }) {
  const { currentUser, data } = ctx;
  const subs = data.submissions.filter(s => s.studentId === currentUser.id);
  return (
    <div className="fadeUp">
      <h2 style={{ fontSize: 20, fontWeight: 800, color: "#fff", marginBottom: 20 }}>My Submissions</h2>
      {subs.length === 0 ? <div className="card" style={{ padding: 40, textAlign: "center", color: "#334155" }}>No submissions yet.</div> :
        <div style={{ display: "grid", gap: 14 }}>
          {subs.slice().reverse().map(s => (
            <div key={s.id} className="card" style={{ padding: 22, borderLeft: `3px solid ${statusColors[s.status]}` }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
                <div style={{ flex: 1 }}>
                  <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 6, flexWrap: "wrap" }}>
                    <span style={{ fontSize: 20 }}>{typeIcons[s.type]}</span>
                    <h3 style={{ fontSize: 15, fontWeight: 700, color: "#e2e8f0" }}>{s.title}</h3>
                    <span className="tag" style={{ background: statusColors[s.status] + "22", color: statusColors[s.status], textTransform: "capitalize" }}>{s.status}</span>
                    <span className="tag" style={{ background: (typeColors[s.type] || "#64748b") + "22", color: typeColors[s.type] || "#64748b", textTransform: "capitalize" }}>{s.type}</span>
                  </div>
                  <p style={{ fontSize: 13, color: "#475569", marginBottom: 8 }}>{s.description}</p>
                  <div style={{ display: "flex", gap: 18, fontSize: 12, color: "#334155", flexWrap: "wrap" }}>
                    <span>📅 {fmtDate(s.activityDate)}</span>
                    <span>⏱ {s.missedClasses} class(es)</span>
                    <span>📎 {s.docName}</span>
                  </div>
                  {s.subjects && s.subjects.length > 0 && (
                    <div style={{ display: "flex", gap: 6, marginTop: 8, flexWrap: "wrap" }}>
                      {s.subjects.map(sid => {
                        const subj = data.subjects.find(x => x.id === sid);
                        return subj ? <span key={sid} className="tag" style={{ background: "#1a2440", color: "#818cf8" }}>{subj.name}</span> : null;
                      })}
                    </div>
                  )}
                </div>
              </div>
              {s.reviewNote && (
                <div style={{ marginTop: 12, padding: "10px 14px", background: s.status === "approved" ? "#10b98115" : "#ef444415", borderRadius: 8, border: `1px solid ${statusColors[s.status]}33` }}>
                  <p style={{ fontSize: 12, color: statusColors[s.status], fontWeight: 700 }}>Reviewer Note:</p>
                  <p style={{ fontSize: 12, color: "#94a3b8", marginTop: 2 }}>{s.reviewNote}</p>
                  {s.reviewedAt && <p style={{ fontSize: 10, color: "#1e2a3a", marginTop: 4 }}>Reviewed on {fmtDate(s.reviewedAt)} by {ctx.data.users.find(u => u.id === s.reviewedBy)?.name}</p>}
                </div>
              )}
            </div>
          ))}
        </div>}
    </div>
  );
}

// ─── Upload Form with Subject Dropdown ───────────────────────────────────────
function UploadForm({ ctx, onSuccess }) {
  const { currentUser, data, addSubmission } = ctx;
  const [form, setForm] = useState({ title: "", type: "fest", activityDate: "", missedClasses: 1, subjects: [], description: "", docName: "" });
  const [uploading, setUploading] = useState(false);
  const fileRef = useRef();

  // Get student's enrolled subjects by matching subjectNames with data.subjects
  const getStudentSubjects = () => {
    if (!currentUser.subjectNames) return data.subjects.filter(s => s.branch === currentUser.branch && s.year === currentUser.year);
    const enrolledNames = currentUser.subjectNames.split(",").map(s => s.trim().toLowerCase());
    const matched = data.subjects.filter(s => enrolledNames.some(en => s.name.toLowerCase().includes(en) || en.includes(s.name.toLowerCase())));
    // Fallback to branch/year match if no name match
    return matched.length > 0 ? matched : data.subjects.filter(s => s.branch === currentUser.branch && s.year === currentUser.year);
  };

  const mySubjects = getStudentSubjects();

  const toggle = (id) => setForm(f => ({ ...f, subjects: f.subjects.includes(id) ? f.subjects.filter(x => x !== id) : [...f.subjects, id] }));

  const submit = async () => {
    if (!form.title || !form.activityDate || form.subjects.length === 0 || !form.description) { ctx.showToast("Please fill all required fields.", "error"); return; }
    setUploading(true);
    await new Promise(r => setTimeout(r, 1000));
    addSubmission({ ...form, docName: form.docName || "document.pdf" }, currentUser.id);
    setUploading(false);
    onSuccess && onSuccess();
  };

  const inputStyle = { width: "100%", padding: "11px 14px", background: "#070a10", border: "1px solid #1e2535", borderRadius: 10, color: "#e2e8f0", fontSize: 14, outline: "none" };
  const labelStyle = { display: "block", fontSize: 11, fontWeight: 700, color: "#475569", marginBottom: 6, textTransform: "uppercase", letterSpacing: "0.8px" };

  return (
    <div className="fadeUp">
      <h2 style={{ fontSize: 20, fontWeight: 800, color: "#fff", marginBottom: 20 }}>New Attendance Request</h2>
      <div className="card" style={{ padding: 28, maxWidth: 680 }}>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 18 }}>
          <div style={{ gridColumn: "1/-1" }}>
            <label style={labelStyle}>Activity Title *</label>
            <input value={form.title} onChange={e => setForm(f => ({ ...f, title: e.target.value }))} placeholder="e.g. TechFest 2024 Hackathon" style={inputStyle} />
          </div>
          <div>
            <label style={labelStyle}>Activity Type *</label>
            <select value={form.type} onChange={e => setForm(f => ({ ...f, type: e.target.value }))} style={inputStyle}>
              {Object.entries(typeIcons).map(([k, v]) => <option key={k} value={k}>{v} {k.charAt(0).toUpperCase() + k.slice(1)}</option>)}
            </select>
          </div>
          <div>
            <label style={labelStyle}>Activity Date *</label>
            <input type="date" value={form.activityDate} onChange={e => setForm(f => ({ ...f, activityDate: e.target.value }))} style={inputStyle} />
          </div>
          <div>
            <label style={labelStyle}>Classes Missed *</label>
            <input type="number" min={1} max={10} value={form.missedClasses} onChange={e => setForm(f => ({ ...f, missedClasses: parseInt(e.target.value) || 1 }))} style={inputStyle} />
          </div>
          {/* Subject Dropdown — affected subjects */}
          <div style={{ gridColumn: "1/-1" }}>
            <label style={labelStyle}>Affected Subjects * <span style={{ fontSize: 10, color: "#334155", textTransform: "none", fontWeight: 400 }}>(select all that apply)</span></label>
            {mySubjects.length === 0 ? (
              <p style={{ fontSize: 12, color: "#334155", padding: "10px 14px", background: "#070a10", borderRadius: 10, border: "1px solid #1e2535" }}>No subjects found for your profile. Contact your teacher.</p>
            ) : (
              <>
                {/* Dropdown style multi-select */}
                <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
                  {mySubjects.map(s => {
                    const isSelected = form.subjects.includes(s.id);
                    const facultyName = data.users.find(u => u.id === s.faculty)?.name;
                    return (
                      <div key={s.id} onClick={() => toggle(s.id)} style={{
                        padding: "10px 14px", background: isSelected ? "#1a2440" : "#070a10",
                        border: `1px solid ${isSelected ? "#3b4fd8" : "#1e2535"}`,
                        borderRadius: 10, cursor: "pointer", display: "flex", alignItems: "center", gap: 12,
                        transition: "all 0.15s",
                      }}>
                        <div style={{ width: 18, height: 18, borderRadius: 5, border: `2px solid ${isSelected ? "#6366f1" : "#334155"}`, background: isSelected ? "#6366f1" : "transparent", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 11, color: "#fff", flexShrink: 0 }}>
                          {isSelected && "✓"}
                        </div>
                        <div style={{ flex: 1 }}>
                          <div style={{ fontSize: 13, fontWeight: 600, color: isSelected ? "#818cf8" : "#94a3b8" }}>{s.name}</div>
                          <div style={{ fontSize: 10, color: "#334155" }}>{s.code} {facultyName ? `· ${facultyName}` : ""}</div>
                        </div>
                        {isSelected && <span style={{ fontSize: 10, color: "#6366f1", fontWeight: 700 }}>Selected</span>}
                      </div>
                    );
                  })}
                </div>
                {form.subjects.length > 0 && (
                  <p style={{ fontSize: 11, color: "#6366f1", marginTop: 6 }}>✓ {form.subjects.length} subject(s) selected — {form.missedClasses} class(es) each will be compensated upon approval</p>
                )}
              </>
            )}
          </div>
          <div style={{ gridColumn: "1/-1" }}>
            <label style={labelStyle}>Description *</label>
            <textarea value={form.description} onChange={e => setForm(f => ({ ...f, description: e.target.value }))} rows={3} placeholder="Describe the activity..." style={{ ...inputStyle, resize: "vertical" }} />
          </div>
          <div style={{ gridColumn: "1/-1" }}>
            <label style={labelStyle}>Upload Proof</label>
            <div onClick={() => fileRef.current?.click()} style={{ border: "2px dashed #1a2030", borderRadius: 12, padding: "22px", textAlign: "center", cursor: "pointer", background: "#070a10" }}>
              <div style={{ fontSize: 26, marginBottom: 6 }}>📎</div>
              <p style={{ fontSize: 13, color: "#334155" }}>{form.docName || "Click to upload PDF, JPG, or PNG"}</p>
            </div>
            <input ref={fileRef} type="file" style={{ display: "none" }} accept=".pdf,.jpg,.png" onChange={e => { if (e.target.files[0]) setForm(f => ({ ...f, docName: e.target.files[0].name })); }} />
          </div>
        </div>
        <button onClick={submit} disabled={uploading} className="btn" style={{ marginTop: 22, padding: "13px 28px", background: uploading ? "#1a2030" : "linear-gradient(135deg,#6366f1,#4f46e5)", color: uploading ? "#334155" : "#fff", fontSize: 14, display: "flex", alignItems: "center", gap: 8, fontWeight: 700 }}>
          {uploading ? <><span style={{ animation: "spin 1s linear infinite", display: "inline-block" }}>⏳</span> Uploading...</> : "⬆️ Submit Request"}
        </button>
      </div>
    </div>
  );
}

// ─── Faculty Dashboard ────────────────────────────────────────────────────────
function FacultyDashboard({ ctx }) {
  const [tab, setTab] = useState("review");
  const tabs = [{ id: "review", label: "Review Queue", icon: "📬" }, { id: "students", label: "Students", icon: "👥" }, { id: "audit", label: "Audit Log", icon: "🔍" }];
  return (
    <div>
      <Nav ctx={ctx} tabs={tabs} activeTab={tab} setActiveTab={setTab} />
      <div style={{ padding: "28px", maxWidth: 1100, margin: "0 auto" }}>
        {tab === "review" && <ReviewQueue ctx={ctx} />}
        {tab === "students" && <FacultyStudents ctx={ctx} />}
        {tab === "audit" && <AuditLogView ctx={ctx} />}
      </div>
    </div>
  );
}

function ReviewQueue({ ctx }) {
  const { currentUser, data, approveSubmission, rejectSubmission } = ctx;
  const [selected, setSelected] = useState(null);
  const [note, setNote] = useState("");
  const pending = data.submissions.filter(s => s.status === "pending");
  const reviewed = data.submissions.filter(s => s.status !== "pending");
  const doApprove = () => { if (!note) { ctx.showToast("Please add a review note.", "error"); return; } approveSubmission(selected.id, note, currentUser.id); setSelected(null); setNote(""); };
  const doReject = () => { if (!note) { ctx.showToast("Please add a rejection reason.", "error"); return; } rejectSubmission(selected.id, note, currentUser.id); setSelected(null); setNote(""); };

  return (
    <div className="fadeUp">
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 22 }}>
        <div>
          <h2 style={{ fontSize: 20, fontWeight: 800, color: "#fff" }}>Review Queue</h2>
          <p style={{ fontSize: 13, color: "#334155", marginTop: 2 }}>{pending.length} pending</p>
        </div>
        <div style={{ display: "flex", gap: 12 }}>
          {[{ label: "Pending", val: pending.length, c: "#f59e0b" }, { label: "Approved", val: data.submissions.filter(s => s.status === "approved").length, c: "#10b981" }, { label: "Rejected", val: data.submissions.filter(s => s.status === "rejected").length, c: "#ef4444" }].map(s => (
            <div key={s.label} style={{ textAlign: "center", padding: "10px 16px", background: "#0d1018", borderRadius: 10, border: "1px solid #1a2030" }}>
              <div style={{ fontSize: 20, fontWeight: 800, color: s.c }}>{s.val}</div>
              <div style={{ fontSize: 10, color: "#334155" }}>{s.label}</div>
            </div>
          ))}
        </div>
      </div>

      {pending.length > 0 && <>
        <h3 style={{ fontSize: 12, fontWeight: 700, color: "#475569", marginBottom: 10, textTransform: "uppercase", letterSpacing: "0.8px" }}>⏳ Pending Review</h3>
        <div style={{ display: "grid", gap: 12, marginBottom: 26 }}>
          {pending.map(s => {
            const student = data.users.find(u => u.id === s.studentId);
            return (
              <div key={s.id} className="card" style={{ padding: 20, borderLeft: "3px solid #f59e0b" }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
                  <div style={{ flex: 1 }}>
                    <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 6, flexWrap: "wrap" }}>
                      <span style={{ fontSize: 18 }}>{typeIcons[s.type]}</span>
                      <h3 style={{ fontSize: 14, fontWeight: 700, color: "#e2e8f0" }}>{s.title}</h3>
                      <span className="tag" style={{ background: (typeColors[s.type] || "#64748b") + "22", color: typeColors[s.type] || "#64748b" }}>{s.type}</span>
                    </div>
                    <p style={{ fontSize: 12, color: "#475569", marginBottom: 8 }}>{s.description}</p>
                    <div style={{ display: "flex", gap: 14, fontSize: 11, color: "#334155", flexWrap: "wrap" }}>
                      <span>👤 {student?.name} ({student?.rollNo})</span>
                      <span>📅 {fmtDate(s.activityDate)}</span>
                      <span>⏱ {s.missedClasses} class(es)</span>
                      <span>📎 {s.docName}</span>
                    </div>
                    <div style={{ display: "flex", gap: 6, marginTop: 8, flexWrap: "wrap" }}>
                      {s.subjects.map(sid => { const subj = data.subjects.find(x => x.id === sid); return subj ? <span key={sid} className="tag" style={{ background: "#151d30", color: "#818cf8" }}>{subj.name} ({subj.code})</span> : null; })}
                    </div>
                  </div>
                  <button onClick={() => { setSelected(s); setNote(""); }} className="btn" style={{ padding: "9px 16px", background: "#151d30", color: "#818cf8", fontSize: 12, border: "1px solid #252f50", whiteSpace: "nowrap" }}>Review →</button>
                </div>
              </div>
            );
          })}
        </div>
      </>}

      {reviewed.length > 0 && <>
        <h3 style={{ fontSize: 12, fontWeight: 700, color: "#475569", marginBottom: 10, textTransform: "uppercase", letterSpacing: "0.8px" }}>📋 Reviewed</h3>
        <div style={{ display: "grid", gap: 8 }}>
          {reviewed.slice().reverse().map(s => {
            const student = data.users.find(u => u.id === s.studentId);
            return (
              <div key={s.id} className="card" style={{ padding: 14, borderLeft: `3px solid ${statusColors[s.status]}` }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                  <div>
                    <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                      <span>{typeIcons[s.type]}</span>
                      <span style={{ fontSize: 13, fontWeight: 600, color: "#94a3b8" }}>{s.title}</span>
                      <span className="tag" style={{ background: statusColors[s.status] + "22", color: statusColors[s.status], textTransform: "capitalize" }}>{s.status}</span>
                    </div>
                    <div style={{ fontSize: 11, color: "#334155", marginTop: 3 }}>{student?.name} · {fmtDate(s.activityDate)}</div>
                  </div>
                  <span style={{ fontSize: 10, color: "#1e2a3a" }}>{fmtDate(s.reviewedAt)}</span>
                </div>
              </div>
            );
          })}
        </div>
      </>}

      {selected && (
        <div style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.8)", zIndex: 200, display: "flex", alignItems: "center", justifyContent: "center", padding: 20 }} onClick={() => setSelected(null)}>
          <div className="card fadeUp" style={{ width: "100%", maxWidth: 500, padding: 28 }} onClick={e => e.stopPropagation()}>
            <h3 style={{ fontSize: 17, fontWeight: 800, color: "#fff", marginBottom: 4 }}>Review Submission</h3>
            <p style={{ fontSize: 13, color: "#334155", marginBottom: 18 }}>{selected.title}</p>
            <div style={{ padding: 14, background: "#070a10", borderRadius: 10, marginBottom: 16, fontSize: 12 }}>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8, color: "#475569" }}>
                <span>Student: <strong style={{ color: "#94a3b8" }}>{data.users.find(u => u.id === selected.studentId)?.name}</strong></span>
                <span>Type: <strong style={{ color: "#94a3b8" }}>{selected.type}</strong></span>
                <span>Missed: <strong style={{ color: "#94a3b8" }}>{selected.missedClasses} classes</strong></span>
                <span>Date: <strong style={{ color: "#94a3b8" }}>{fmtDate(selected.activityDate)}</strong></span>
              </div>
              <p style={{ marginTop: 10, color: "#475569" }}>{selected.description}</p>
              <div style={{ display: "flex", gap: 6, marginTop: 8, flexWrap: "wrap" }}>
                {selected.subjects.map(sid => { const subj = data.subjects.find(x => x.id === sid); return subj ? <span key={sid} className="tag" style={{ background: "#151d30", color: "#818cf8" }}>{subj.name}</span> : null; })}
              </div>
            </div>
            <label style={{ display: "block", fontSize: 11, fontWeight: 700, color: "#475569", marginBottom: 6, textTransform: "uppercase", letterSpacing: "0.8px" }}>Review Note *</label>
            <textarea value={note} onChange={e => setNote(e.target.value)} rows={3} placeholder="Add your review comments..." style={{ width: "100%", padding: "11px 14px", background: "#070a10", border: "1px solid #1a2030", borderRadius: 10, color: "#e2e8f0", fontSize: 14, outline: "none", resize: "vertical", marginBottom: 16 }} />
            <div style={{ display: "flex", gap: 10 }}>
              <button onClick={doApprove} className="btn" style={{ flex: 1, padding: 12, background: "linear-gradient(135deg,#10b981,#059669)", color: "#fff", fontSize: 13, fontWeight: 700 }}>✓ Approve</button>
              <button onClick={doReject} className="btn" style={{ flex: 1, padding: 12, background: "linear-gradient(135deg,#ef4444,#dc2626)", color: "#fff", fontSize: 13, fontWeight: 700 }}>✕ Reject</button>
              <button onClick={() => setSelected(null)} className="btn" style={{ padding: "12px 16px", background: "#1a2030", color: "#475569", fontSize: 13 }}>Cancel</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

function FacultyStudents({ ctx }) {
  const { data } = ctx;
  const students = data.users.filter(u => u.role === "student");
  return (
    <div className="fadeUp">
      <h2 style={{ fontSize: 20, fontWeight: 800, color: "#fff", marginBottom: 20 }}>Student Records</h2>
      <div style={{ display: "grid", gap: 12 }}>
        {students.map(s => {
          const att = getStudentAttendance(s.id, data);
          const avg = att.length > 0 ? Math.round(att.reduce((a, b) => a + b.pct, 0) / att.length) : 0;
          const subs = data.submissions.filter(x => x.studentId === s.id);
          return (
            <div key={s.id} className="card" style={{ padding: 18 }}>
              <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
                <div style={{ width: 40, height: 40, borderRadius: "50%", background: "linear-gradient(135deg,#6366f1,#10b981)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 12, fontWeight: 700, color: "#fff" }}>{s.avatar}</div>
                <div style={{ flex: 1 }}>
                  <p style={{ fontSize: 14, fontWeight: 700, color: "#e2e8f0" }}>{s.name}</p>
                  <p style={{ fontSize: 11, color: "#334155" }}>{s.rollNo} · {s.branch} · Year {s.year}{s.teacherName ? ` · 👩‍🏫 ${s.teacherName}` : ""}</p>
                </div>
                <div style={{ display: "flex", gap: 18, textAlign: "center" }}>
                  <div><div style={{ fontSize: 18, fontWeight: 800, color: avg >= 75 ? "#10b981" : "#ef4444" }}>{avg}%</div><div style={{ fontSize: 10, color: "#334155" }}>Avg Att.</div></div>
                  <div><div style={{ fontSize: 18, fontWeight: 800, color: "#f59e0b" }}>{subs.filter(x => x.status === "pending").length}</div><div style={{ fontSize: 10, color: "#334155" }}>Pending</div></div>
                  <div><div style={{ fontSize: 18, fontWeight: 800, color: "#6366f1" }}>{subs.length}</div><div style={{ fontSize: 10, color: "#334155" }}>Total Reqs</div></div>
                </div>
                {!s.onboarded && <span className="tag" style={{ background: "#f59e0b22", color: "#f59e0b" }}>Pending Setup</span>}
              </div>
              {s.subjectNames && (
                <div style={{ marginTop: 10, display: "flex", flexWrap: "wrap", gap: 6 }}>
                  {s.subjectNames.split(",").map(sub => sub.trim()).filter(Boolean).map((sub, i) => (
                    <span key={i} style={{ padding: "3px 10px", background: "#0d1018", color: "#475569", borderRadius: 20, fontSize: 10, fontWeight: 600, border: "1px solid #1a2030" }}>{sub}</span>
                  ))}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}

function AuditLogView({ ctx }) {
  const { data } = ctx;
  const colors = { APPROVE: "#10b981", REJECT: "#ef4444", SUBMIT: "#6366f1", LOGIN: "#f59e0b", SIGNUP: "#ec4899", REGISTER: "#10b981", DELETE_USER: "#ef4444", ADD_ATTENDANCE: "#10b981", UPDATE_ATTENDANCE: "#6366f1" };
  return (
    <div className="fadeUp">
      <h2 style={{ fontSize: 20, fontWeight: 800, color: "#fff", marginBottom: 20 }}>Audit Trail</h2>
      <div className="card" style={{ overflow: "hidden" }}>
        {data.auditLog.slice().reverse().map((log, i) => {
          const user = data.users.find(u => u.id === log.userId);
          return (
            <div key={log.id} style={{ display: "flex", alignItems: "flex-start", gap: 12, padding: "12px 18px", borderBottom: i < data.auditLog.length - 1 ? "1px solid #111820" : "none", background: i % 2 === 0 ? "transparent" : "#0a0d14" }}>
              <span className="tag" style={{ background: (colors[log.action] || "#64748b") + "22", color: colors[log.action] || "#64748b", whiteSpace: "nowrap" }}>{log.action}</span>
              <div style={{ flex: 1 }}>
                <p style={{ fontSize: 12, color: "#94a3b8" }}>{log.detail}</p>
                <p style={{ fontSize: 10, color: "#1e2a3a", marginTop: 3 }}>By: {user?.name || log.userId} · {fmtDate(log.time)} at {fmtTime(log.time)}</p>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

// ─── Admin Dashboard ──────────────────────────────────────────────────────────
function AdminDashboard({ ctx }) {
  const [tab, setTab] = useState("analytics");
  const tabs = [{ id: "analytics", label: "Analytics", icon: "📈" }, { id: "all-submissions", label: "All Submissions", icon: "📋" }, { id: "users", label: "Users", icon: "👥" }, { id: "audit", label: "Audit Log", icon: "🔍" }];
  return (
    <div>
      <Nav ctx={ctx} tabs={tabs} activeTab={tab} setActiveTab={setTab} />
      <div style={{ padding: "28px", maxWidth: 1100, margin: "0 auto" }}>
        {tab === "analytics" && <Analytics ctx={ctx} />}
        {tab === "all-submissions" && <AllSubmissions ctx={ctx} />}
        {tab === "users" && <UsersTable ctx={ctx} />}
        {tab === "audit" && <AuditLogView ctx={ctx} />}
      </div>
    </div>
  );
}

function Analytics({ ctx }) {
  const { data } = ctx;
  const subs = data.submissions;
  const total = subs.length, approved = subs.filter(s => s.status === "approved").length, pending = subs.filter(s => s.status === "pending").length, rejected = subs.filter(s => s.status === "rejected").length;
  const approvalRate = total > 0 ? Math.round((approved / total) * 100) : 0;
  const byType = Object.entries(typeIcons).map(([k]) => ({ type: k, count: subs.filter(s => s.type === k).length })).filter(x => x.count > 0);
  const students = data.users.filter(u => u.role === "student");
  const avgAtt = students.map(s => { const att = getStudentAttendance(s.id, data); return att.length > 0 ? att.reduce((a, b) => a + b.pct, 0) / att.length : 0; });
  const overallAvg = avgAtt.length > 0 ? Math.round(avgAtt.reduce((a, b) => a + b, 0) / avgAtt.length) : 0;
  return (
    <div className="fadeUp">
      <h2 style={{ fontSize: 20, fontWeight: 800, color: "#fff", marginBottom: 22 }}>Analytics & Reports</h2>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(4,1fr)", gap: 14, marginBottom: 22 }}>
        {[{ label: "Total Requests", value: total, icon: "📋", color: "#6366f1" }, { label: "Approved", value: approved, icon: "✅", color: "#10b981" }, { label: "Pending", value: pending, icon: "⏳", color: "#f59e0b" }, { label: "Approval Rate", value: `${approvalRate}%`, icon: "📈", color: "#ec4899" }].map(s => (
          <div key={s.label} className="card" style={{ padding: 18 }}>
            <div style={{ fontSize: 22, marginBottom: 8 }}>{s.icon}</div>
            <div style={{ fontSize: 28, fontWeight: 800, color: s.color }}>{s.value}</div>
            <div style={{ fontSize: 11, color: "#334155", marginTop: 4 }}>{s.label}</div>
          </div>
        ))}
      </div>
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 18, marginBottom: 18 }}>
        <div className="card" style={{ padding: 22 }}>
          <h3 style={{ fontSize: 14, fontWeight: 700, color: "#94a3b8", marginBottom: 16 }}>Submissions by Type</h3>
          {byType.map(({ type, count }) => (
            <div key={type} style={{ marginBottom: 12 }}>
              <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 5 }}>
                <span style={{ fontSize: 12, color: "#94a3b8" }}>{typeIcons[type]} {type.charAt(0).toUpperCase() + type.slice(1)}</span>
                <span style={{ fontSize: 12, fontWeight: 700, color: typeColors[type] }}>{count}</span>
              </div>
              <div style={{ height: 5, background: "#1a2030", borderRadius: 3 }}>
                <div style={{ height: "100%", width: `${(count / total) * 100}%`, background: typeColors[type], borderRadius: 3 }} />
              </div>
            </div>
          ))}
        </div>
        <div className="card" style={{ padding: 22 }}>
          <h3 style={{ fontSize: 14, fontWeight: 700, color: "#94a3b8", marginBottom: 16 }}>Status Overview</h3>
          {[{ label: "Approved", val: approved, color: "#10b981" }, { label: "Pending", val: pending, color: "#f59e0b" }, { label: "Rejected", val: rejected, color: "#ef4444" }].map(s => (
            <div key={s.label} style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 14 }}>
              <div style={{ width: 48, height: 48, borderRadius: "50%", background: s.color + "22", border: `3px solid ${s.color}`, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 16, fontWeight: 800, color: s.color }}>{s.val}</div>
              <div>
                <div style={{ fontSize: 13, fontWeight: 600, color: "#cbd5e1" }}>{s.label}</div>
                <div style={{ fontSize: 11, color: "#334155" }}>{total > 0 ? Math.round((s.val / total) * 100) : 0}% of total</div>
              </div>
              <div style={{ flex: 1, height: 5, background: "#1a2030", borderRadius: 3 }}>
                <div style={{ height: "100%", width: `${total > 0 ? (s.val / total) * 100 : 0}%`, background: s.color, borderRadius: 3 }} />
              </div>
            </div>
          ))}
        </div>
      </div>
      <div className="card" style={{ padding: 22 }}>
        <h3 style={{ fontSize: 14, fontWeight: 700, color: "#94a3b8", marginBottom: 16 }}>Student Attendance · Overall Avg: {overallAvg}%</h3>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(3,1fr)", gap: 12 }}>
          {students.map(s => {
            const att = getStudentAttendance(s.id, data);
            const avg = att.length > 0 ? Math.round(att.reduce((a, b) => a + b.pct, 0) / att.length) : 0;
            return (
              <div key={s.id} style={{ padding: 14, background: "#070a10", borderRadius: 10, border: "1px solid #1a2030" }}>
                <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 8 }}>
                  <div style={{ width: 30, height: 30, borderRadius: "50%", background: "linear-gradient(135deg,#6366f1,#10b981)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 10, fontWeight: 700, color: "#fff" }}>{s.avatar}</div>
                  <div style={{ flex: 1 }}>
                    <p style={{ fontSize: 12, fontWeight: 700, color: "#cbd5e1" }}>{s.name.split(" ")[0]}</p>
                    <p style={{ fontSize: 10, color: "#334155" }}>{s.rollNo}</p>
                  </div>
                  <span style={{ fontSize: 16, fontWeight: 800, color: avg >= 75 ? "#10b981" : "#ef4444" }}>{avg}%</span>
                </div>
                <div style={{ height: 4, background: "#1a2030", borderRadius: 2 }}>
                  <div style={{ height: "100%", width: `${avg}%`, background: avg >= 75 ? "#10b981" : "#ef4444", borderRadius: 2 }} />
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

function AllSubmissions({ ctx }) {
  const { data } = ctx;
  const [filter, setFilter] = useState("all");
  const filtered = filter === "all" ? data.submissions : data.submissions.filter(s => s.status === filter);
  return (
    <div className="fadeUp">
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 20 }}>
        <h2 style={{ fontSize: 20, fontWeight: 800, color: "#fff" }}>All Submissions</h2>
        <div style={{ display: "flex", gap: 6 }}>
          {["all", "pending", "approved", "rejected"].map(f => (
            <button key={f} onClick={() => setFilter(f)} className="btn" style={{ padding: "7px 14px", fontSize: 11, fontWeight: 700, textTransform: "capitalize", background: filter === f ? "#151d30" : "#0d1018", color: filter === f ? "#818cf8" : "#334155", border: `1px solid ${filter === f ? "#2e3f6e" : "#1a2030"}` }}>{f}</button>
          ))}
        </div>
      </div>
      <div style={{ display: "grid", gap: 10 }}>
        {filtered.slice().reverse().map(s => {
          const student = data.users.find(u => u.id === s.studentId);
          return (
            <div key={s.id} className="card" style={{ padding: 16, borderLeft: `3px solid ${statusColors[s.status]}` }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <div style={{ flex: 1 }}>
                  <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 4, flexWrap: "wrap" }}>
                    <span>{typeIcons[s.type]}</span>
                    <span style={{ fontSize: 14, fontWeight: 700, color: "#e2e8f0" }}>{s.title}</span>
                    <span className="tag" style={{ background: statusColors[s.status] + "22", color: statusColors[s.status], textTransform: "capitalize" }}>{s.status}</span>
                  </div>
                  <div style={{ fontSize: 11, color: "#334155", display: "flex", gap: 12, flexWrap: "wrap" }}>
                    <span>👤 {student?.name} ({student?.rollNo})</span>
                    <span>📅 {fmtDate(s.activityDate)}</span>
                    <span>⏱ {s.missedClasses} class(es)</span>
                    {s.subjects && s.subjects.map(sid => { const subj = data.subjects.find(x => x.id === sid); return subj ? <span key={sid} className="tag" style={{ background: "#151d30", color: "#818cf8", fontSize: 10 }}>{subj.code}</span> : null; })}
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

function UsersTable({ ctx }) {
  const { data, setData, currentUser, showToast } = ctx;
  const [confirmDelete, setConfirmDelete] = useState(null);
  const roles = ["student", "faculty", "admin"];

  const handleDelete = (userId) => {
    if (userId === currentUser.id) { showToast("You cannot remove your own account.", "error"); return; }
    const user = data.users.find(u => u.id === userId);
    setData(prev => ({
      ...prev, users: prev.users.filter(u => u.id !== userId),
      auditLog: [...prev.auditLog, { id: "al" + Date.now(), action: "DELETE_USER", userId: currentUser.id, targetId: userId, detail: `Admin removed user: ${user?.email}`, time: new Date().toISOString() }],
    }));
    showToast(`User removed.`);
    setConfirmDelete(null);
  };

  return (
    <div className="fadeUp">
      <h2 style={{ fontSize: 20, fontWeight: 800, color: "#fff", marginBottom: 20 }}>User Management</h2>
      {roles.map(role => {
        const users = data.users.filter(u => u.role === role);
        return (
          <div key={role} style={{ marginBottom: 26 }}>
            <h3 style={{ fontSize: 12, fontWeight: 700, color: "#475569", marginBottom: 10, textTransform: "uppercase", letterSpacing: "0.8px" }}>{role}s ({users.length})</h3>
            <div className="card" style={{ overflow: "hidden" }}>
              {users.map((u, i) => (
                <div key={u.id} style={{ display: "flex", alignItems: "center", gap: 14, padding: "12px 18px", borderBottom: i < users.length - 1 ? "1px solid #111820" : "none" }}>
                  <div style={{ width: 34, height: 34, borderRadius: "50%", background: "linear-gradient(135deg,#6366f1,#10b981)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 10, fontWeight: 700, color: "#fff" }}>{u.avatar}</div>
                  <div style={{ flex: 1 }}>
                    <p style={{ fontSize: 13, fontWeight: 700, color: "#e2e8f0" }}>{u.name}</p>
                    <p style={{ fontSize: 11, color: "#334155" }}>{u.email}{u.rollNo ? ` · ${u.rollNo}` : ""}{u.dept ? ` · ${u.dept}` : ""}</p>
                    {u.subjectsTaught && <p style={{ fontSize: 10, color: "#1e3a2a" }}>Teaches: {u.subjectsTaught}</p>}
                  </div>
                  <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
                    {!u.onboarded && <span className="tag" style={{ background: "#f59e0b22", color: "#f59e0b" }}>Setup Pending</span>}
                    <span className="tag" style={{ background: "#151d30", color: "#818cf8", textTransform: "capitalize" }}>{u.role}</span>
                    {u.id !== currentUser.id && (
                      confirmDelete === u.id ? (
                        <div style={{ display: "flex", gap: 6 }}>
                          <button onClick={() => handleDelete(u.id)} style={{ padding: "4px 10px", background: "#ef444422", border: "1px solid #ef4444", borderRadius: 6, color: "#ef4444", fontSize: 11, fontWeight: 700, cursor: "pointer" }}>Confirm</button>
                          <button onClick={() => setConfirmDelete(null)} style={{ padding: "4px 10px", background: "#111520", border: "1px solid #1a2030", borderRadius: 6, color: "#475569", fontSize: 11, cursor: "pointer" }}>Cancel</button>
                        </div>
                      ) : (
                        <button onClick={() => setConfirmDelete(u.id)} style={{ padding: "5px 10px", background: "#ef444415", border: "1px solid #ef444433", borderRadius: 6, color: "#ef4444", fontSize: 11, fontWeight: 700, cursor: "pointer" }}>🗑 Remove</button>
                      )
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        );
      })}
    </div>
  );
}