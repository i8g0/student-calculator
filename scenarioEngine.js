// ScenarioEngine: lightweight classes to represent Student/Semester/Course and provide simulation utilities

const GRADE_VALUES = {
  'A+': 5,
  'A': 4.75,
  'B+': 4.5,
  'B': 4,
  'C+': 3.5,
  'C': 3,
  'D+': 2.5,
  'D': 2,
  'F': 0
};

class Course {
  constructor({ courseCode = '', name = '', creditHours = 0, grade = 'F', isFuture = true, term = '' } = {}) {
    this.courseCode = courseCode;
    this.courseName = name;
    this.creditHours = Number(creditHours) || 0;
    this.grade = grade;
    this.isFuture = isFuture;
    this.term = term || '';
  }
  setGrade(newGrade) {
    this.grade = newGrade;
  }
  getPoints() {
    return (GRADE_VALUES[this.grade] || 0) * (this.creditHours || 0);
  }
}

class Semester {
  constructor({ termName = '', isCompleted = false, courses = [] } = {}) {
    this.termName = termName;
    this.isCompleted = !!isCompleted;
    this.courses = courses.map(c => (c instanceof Course ? c : new Course(c)));
  }
  getSemesterGPA() {
    let totalPoints = 0;
    let totalCredits = 0;
    this.courses.forEach(c => {
      totalPoints += c.getPoints();
      totalCredits += c.creditHours || 0;
    });
    return totalCredits === 0 ? 0 : +(totalPoints / totalCredits).toFixed(2);
  }
}

class Student {
  constructor({ studentID = '', name = '', currentGPA = 0, totalCredits = 0, semesters = [] } = {}) {
    this.studentID = studentID;
    this.name = name;
    this.currentGPA = Number(currentGPA) || 0;
    this.totalCredits = Number(totalCredits) || 0;
    this.semesters = semesters.map(s => (s instanceof Semester ? s : new Semester(s)));
  }
  calculateCumulativeGPA() {
    // Compute GPA across stored semesters + currentGPA snapshot
    let totalPoints = this.currentGPA * this.totalCredits;
    let totalCredits = this.totalCredits;
    this.semesters.forEach(sem => {
      sem.courses.forEach(c => {
        totalPoints += c.getPoints();
        totalCredits += c.creditHours || 0;
      });
    });
    return totalCredits === 0 ? 0 : +(totalPoints / totalCredits).toFixed(2);
  }
  addSemester(semester) {
    this.semesters.push(semester instanceof Semester ? semester : new Semester(semester));
  }
}

class ScenarioEngine {
  constructor({ currentGPA = 0, completedCredits = 0 } = {}) {
    this.student = new Student({ currentGPA, totalCredits: completedCredits });
  }

  // courses: array of plain objects { id, name, credits, grade, term }
  // returns { labels: [], values: [] } where values are cumulative GPA after each term
  generateTimelineData(courses = []) {
    let labels = ['Current'];
    let values = [];

    let totalPoints = this.student.currentGPA * this.student.totalCredits;
    let totalCredits = this.student.totalCredits;

    const currentGPAVal = totalCredits === 0 ? 0 : +((totalPoints / totalCredits).toFixed(2));
    values.push(currentGPAVal);

    // Determine term order by first appearance
    const terms = [...new Set((courses || []).map(c => (c.term && String(c.term).trim() !== '' ? c.term : 'Future')))] ;

    terms.forEach(term => {
      const termCourses = (courses || []).filter(c => ((c.term && String(c.term).trim() !== '') ? c.term : 'Future') === term);
      termCourses.forEach(tc => {
        const gp = GRADE_VALUES[tc.grade] || 0;
        const cr = Number(tc.credits) || 0;
        totalPoints += gp * cr;
        totalCredits += cr;
      });
      const gpa = totalCredits === 0 ? 0 : +((totalPoints / totalCredits).toFixed(2));
      labels.push(term);
      values.push(gpa);
    });

    return { labels, values };
  }

  applyMagicToggle(courses = [], mode = 'max') {
    if (!Array.isArray(courses)) return courses;
    if (mode === 'max') return courses.map(c => ({ ...c, grade: 'A+' }));
    if (mode === 'min') return courses.map(c => ({ ...c, grade: 'D' }));
    return courses;
  }

  // Simple reverse calculation: returns required average grade value and recommended uniform grade
  calculateRequiredGrades(courses = [], targetGPA = 0) {
    const tgt = Number(targetGPA);
    if (isNaN(tgt)) return { error: 'Target must be a number' };

    const totalPoints = this.student.currentGPA * this.student.totalCredits;
    const totalCredits = this.student.totalCredits;
    const remainingCredits = (courses || []).reduce((s, c) => s + (Number(c.credits) || 0), 0);
    if (remainingCredits === 0) return { error: 'No future courses' };

    const totalCreditsAfter = totalCredits + remainingCredits;
    const requiredTotalPoints = tgt * totalCreditsAfter;
    const pointsNeeded = requiredTotalPoints - totalPoints;
    const requiredAverage = pointsNeeded / remainingCredits;

    if (requiredAverage > 5) return { error: 'Target not achievable with current future courses' };

    // pick the smallest grade whose numeric value >= requiredAverage
    const gradesSorted = Object.entries(GRADE_VALUES).map(([g, v]) => ({ grade: g, value: v })).sort((a, b) => a.value - b.value);
    let recommended = gradesSorted[gradesSorted.length - 1].grade; // default highest
    for (let i = 0; i < gradesSorted.length; i++) {
      if (gradesSorted[i].value >= requiredAverage) {
        recommended = gradesSorted[i].grade;
        break;
      }
    }

    const perCourse = (courses || []).map(c => ({ id: c.id, name: c.name, credits: c.credits, recommendedGrade: recommended }));

    return { requiredAverage: +requiredAverage.toFixed(2), perCourse };
  }
}

export { Course, Semester, Student, ScenarioEngine, GRADE_VALUES };
