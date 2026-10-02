
import { useMemo, useState } from "react";
import "./index.css";

const INITIAL_CAPACITY = {
  CSE: 2,
  ECE: 1,
  EEE: 1,
};

const BRANCHES = ["CSE", "ECE", "EEE"];

function App() {
  const [students, setStudents] = useState([]);
  const [name, setName] = useState("");
  const [rank, setRank] = useState("");
  const [preferences, setPreferences] = useState(["CSE", "ECE", "EEE"]);

  const allotmentResults = useMemo(() => {
    const sortedStudents = [...students].sort(
      (a, b) => a.rank - b.rank || a.id - b.id
    );

    const remainingSeats = { ...INITIAL_CAPACITY };

    return sortedStudents.map((student) => {
      let allottedBranch = null;

      for (const preferredBranch of student.preferences) {
        if (remainingSeats[preferredBranch] > 0) {
          allottedBranch = preferredBranch;
          remainingSeats[preferredBranch] -= 1;
          break;
        }
      }

      return {
        ...student,
        allottedBranch: allottedBranch ?? "—",
        status: allottedBranch ? "Allotted" : "Not Allotted",
      };
    });
  }, [students]);

  


function movePreference(index, direction) {
  setPreferences((previous) => {
    const updated = [...previous];
    const newIndex = index + direction;

    if (newIndex < 0 || newIndex >= updated.length) {
      return previous;
    }

    [updated[index], updated[newIndex]] = [
      updated[newIndex],
      updated[index],
    ];

    return updated;
  });
}


  function handleSubmit(event) {
    event.preventDefault();

    if (!name.trim() || !rank || !Number.isInteger(Number(rank)) || Number(rank) <= 0) {
      alert("Enter a student name and a valid positive whole-number rank.");
      return;
    }

    if (preferences.length === 0) {
      alert("Select at least one branch preference.");
      return;
    }

    const newStudent = {
      id: Date.now(),
      name: name.trim(),
      rank: Number(rank),
      preferences: [...preferences],
    };

    setStudents((previous) => [...previous, newStudent]);

    setName("");
    setRank("");
    setPreferences(["CSE", "ECE", "EEE"]);
  }

  return (
    <main className="app">
      <h1>Seat Allotment Tracker</h1>
      <p className="subtitle">
        Student Registration and Automatic Seat Allotment
      </p>

      <section className="panel">
        <h2>Branch Seat Capacity</h2>
        <div className="capacity-list">
          {Object.entries(INITIAL_CAPACITY).map(([branchName, capacity]) => (
            <div className="capacity-item" key={branchName}>
              <strong>{branchName}</strong>
              <span>{capacity} seats</span>
            </div>
          ))}
        </div>
      </section>

      <section className="panel">
        <h2>Register Student</h2>

        <form onSubmit={handleSubmit}>
          <label htmlFor="name">Student Name</label>
          <input
            id="name"
            value={name}
            onChange={(event) => setName(event.target.value)}
            placeholder="Enter student name"
            required
          />

          <label htmlFor="rank">Entrance Exam Rank</label>
          <input
            id="rank"
            type="number"
            min="1"
            step="1"
            value={rank}
            onChange={(event) => setRank(event.target.value)}
            placeholder="Enter rank"
            required
          />

         
<fieldset className="preferences">
  <legend>Arrange Branch Preferences</legend>

  {preferences.length === 0 && (
    <p className="hint">Add at least one branch preference.</p>
  )}

  {preferences.map((branchName, index) => (
    <div className="preference-row" key={branchName}>
      <strong>
        {index + 1}. {branchName}
      </strong>

      <div className="preference-actions">
        <button
          type="button"
          onClick={() => movePreference(index, -1)}
          disabled={index === 0}
        >
          Move Up
        </button>

        <button
          type="button"
          onClick={() => movePreference(index, 1)}
          disabled={index === preferences.length - 1}
        >
          Move Down
        </button>

        <button
          type="button"
          onClick={() =>
            setPreferences((previous) =>
              previous.filter((item) => item !== branchName)
            )
          }
        >
          Remove
        </button>
      </div>
    </div>
  ))}

  <label htmlFor="add-branch">Add a branch</label>
  <select
    id="add-branch"
    value=""
    onChange={(event) => {
      const selectedBranch = event.target.value;

      if (selectedBranch) {
        setPreferences((previous) =>
          previous.includes(selectedBranch)
            ? previous
            : [...previous, selectedBranch]
        );
      }
    }}
  >
    <option value="">Choose a branch</option>
    {BRANCHES.filter(
      (branchName) => !preferences.includes(branchName)
    ).map((branchName) => (
      <option key={branchName} value={branchName}>
        {branchName}
      </option>
    ))}
  </select>

  <p className="hint">
    The app checks branches from top to bottom during allotment.
  </p>
</fieldset>

          <button type="submit">Add Student</button>
        </form>
      </section>

      <section className="panel">
        <h2>Registered Students ({students.length})</h2>

        {students.length === 0 ? (
          <p>No students registered yet.</p>
        ) : (
          <div className="table-wrapper">
            <table>
              <thead>
                <tr>
                  <th>Rank</th>
                  <th>Name</th>
                  <th>Preferences</th>
                </tr>
              </thead>
              <tbody>
                {allotmentResults.map((student) => (
                  <tr key={student.id}>
                    <td>{student.rank}</td>
                    <td>{student.name}</td>
                    <td>{student.preferences.join(" → ")}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </section>

      <section className="panel">
        <h2>Allotment Results</h2>

        {allotmentResults.length === 0 ? (
          <p>Register students to see allotment results.</p>
        ) : (
          <div className="table-wrapper">
            <table>
              <thead>
                <tr>
                  <th>Rank</th>
                  <th>Student</th>
                  <th>Preferences</th>
                  <th>Allotted Branch</th>
                  <th>Status</th>
                </tr>
              </thead>
              <tbody>
                {allotmentResults.map((student) => (
                  <tr key={student.id}>
                    <td>{student.rank}</td>
                    <td>{student.name}</td>
                    <td>{student.preferences.join(" → ")}</td>
                    <td>{student.allottedBranch}</td>
                    <td>
                      <span
                        className={
                          student.status === "Allotted"
                            ? "status-success"
                            : "status-failed"
                        }
                      >
                        {student.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </section>
    </main>
  );
}

export default App;