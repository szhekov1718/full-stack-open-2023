const Total = ({ parts }) => {

	const total = parts.reduce((sum, part) => sum + part.exercises, 0)

	return (
		<p><b>total of {total} exercises</b></p>
	)
}

const Content = ({ parts }) => {

	return (
		<div>
			{parts.map(part => 
            <p key={part.id}>{part.name} {part.exercises}</p>
            )}
		</div>
	)
}

const Header = ({ course }) => {
    
	return (
		<h2>{course}</h2>
	)
}

const Course = ({ course }) => {

	return (
		<div>
			<Header course={course.name} />
			<Content parts={course.parts} />
			<Total parts={course.parts} />
		</div>
	)
};

export default Course;