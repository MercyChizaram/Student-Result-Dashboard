
type Student = {
  id: number;
  name: string;
  course: string;
  score: number;
};

const students: Student[] = [
  {
    id: 1,
    name: "Daniel",
    course: "JavaScript",
    score: 85,
  },
  {
    id: 2,
    name: "Charles",
    course: "React",
    score: 72,
  },
  {
    id: 3,
    name: "Mercy",
    course: "TypeScript",
    score: 45,
  },
  {
    id: 4,
    name: "John",
    course: "Next.js",
    score: 90,
  },
  {
    id: 5,
    name: "David",
    course: "Tailwind CSS",
    score: 38,
  },
];

export default function Home() {
  const passedStudents = students.filter(
    (student) => student.score >= 50
  );

  const failedStudents = students.filter(
    (student) => student.score < 50
  );

  return (
    <main className="min-h-screen bg-slate-100 px-5 py-10">
      <div className="mx-auto max-w-6xl">

        {/* Header */}
        <div className="mb-8">
          <p className="text-sm font-medium text-blue-600">
            STUDENT MANAGEMENT
          </p>

          <h1 className="mt-2 text-3xl font-bold text-slate-900">
            Student Result Dashboard
          </h1>

          <p className="mt-2 text-slate-500">
            View student information and academic performance.
          </p>
        </div>

        {/* Statistics */}
        <div className="mb-8 grid gap-5 sm:grid-cols-3">

          <div className="rounded-xl bg-white p-6 shadow-sm">
            <p className="text-sm text-slate-500">
              Total Students
            </p>

            <h2 className="mt-2 text-3xl font-bold text-slate-900">
              {students.length}
            </h2>
          </div>

          <div className="rounded-xl bg-white p-6 shadow-sm">
            <p className="text-sm text-slate-500">
              Passed Students
            </p>

            <h2 className="mt-2 text-3xl font-bold text-green-600">
              {passedStudents.length}
            </h2>
          </div>

          <div className="rounded-xl bg-white p-6 shadow-sm">
            <p className="text-sm text-slate-500">
              Failed Students
            </p>

            <h2 className="mt-2 text-3xl font-bold text-red-600">
              {failedStudents.length}
            </h2>
          </div>

        </div>

        {/* Student List */}
        <div className="rounded-xl bg-white p-6 shadow-sm">

          <h2 className="mb-6 text-xl font-bold text-slate-900">
            Student Records
          </h2>

          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">

            {students.map((student) => (

              <div
                key={student.id}
                className="rounded-xl border border-slate-200 p-5"
              >

                <div className="mb-4 flex items-center justify-between">

                  <div>
                    <h3 className="text-lg font-bold text-slate-900">
                      {student.name}
                    </h3>

                    <p className="text-sm text-slate-500">
                      Student ID: {student.id}
                    </p>
                  </div>

                  <div className="flex h-11 w-11 items-center justify-center rounded-full bg-blue-100 font-bold text-blue-700">
                    {student.name.charAt(0)}
                  </div>

                </div>

                <p className="mb-3 text-sm text-slate-600">
                  Course: {student.course}
                </p>

                <div className="mb-4 flex items-center justify-between">
                  <span className="text-sm text-slate-500">
                    Score
                  </span>

                  <span className="text-xl font-bold text-slate-900">
                    {student.score}%
                  </span>
                </div>

                <div className="h-2 w-full rounded-full bg-slate-200">
                  <div
                    className={`h-2 rounded-full ${
                      student.score >= 50
                        ? "bg-green-500"
                        : "bg-red-500"
                    }`}
                    style={{ width: `${student.score}%` }}
                  ></div>
                </div>

                <div className="mt-4">
                  {student.score >= 50 ? (
                    <span className="rounded-full bg-green-100 px-3 py-1 text-xs font-semibold text-green-700">
                      Passed
                    </span>
                  ) : (
                    <span className="rounded-full bg-red-100 px-3 py-1 text-xs font-semibold text-red-700">
                      Failed
                    </span>
                  )}
                </div>

              </div>

            ))}

          </div>

        </div>

      </div>
    </main>
  );
}
