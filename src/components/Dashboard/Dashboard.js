/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable no-unused-vars */
import React, { useEffect, useState } from 'react';
import { connect } from 'react-redux';
import Timetable from './Timetable.js';
import Calender from './Calender2.js'
import { Card } from "react-bootstrap";
import './dashboard.scss';
import { priorities } from './data.js';
import { getDash } from '../../store/dashboard';
import { getSessions } from '../../store/allSessions';
import Fab from "@material-ui/core/Fab";
import { makeStyles } from '@material-ui/core/styles';
import AddIcon from "@material-ui/icons/Add";
import { withSnackbar } from 'notistack';
import { green, deepOrange, lightBlue, yellow, purple } from "@material-ui/core/colors";

const useStyles = makeStyles((theme) => ({
  addButton: {
    position: "fixed",
    bottom: '30vh',
    right: '10vh'
  }
}));

const Dashboard = props => {
  const [sessions, setSessions] = useState([]);
  const classes = useStyles();
  const [show, setShow] = useState(false);
  const [count, setCount] = useState(0);

  const convertToSessions = (allSessions) => {
    console.log('All sessions in timetable', allSessions);

    if (allSessions && allSessions.length > 0) {
      const modSessions = allSessions.map((session, index) => {
        let start = new Date(session.date);
        console.log(' from start', start);
        console.log(' a sessions in timetable', start.getTime(), session.time);
        console.log(' Added session', new Date(start.getTime() + session.time));
        let prioColor;
        priorities.forEach(subject => {
          if (session.lesson.toLowerCase().includes(subject.text.toLowerCase())) {
            prioColor = subject.id;
          }
        })

        return {
          id: index,
          startDate: new Date(new Date(session.date).getTime()),
          endDate: new Date(start.getTime() + session.time),
          title: `${session.lesson} \n  ${session.completed*100}% in ${session.time / 600000} minutes`,
          priorityId: prioColor,
        }
      });
      
      console.log('inserting into calendar', modSessions);
      setSessions(modSessions);
    }
  }

  useEffect(async() => {
    await props.getDash();
    await props.getSessions();
    convertToSessions(props.sessions);

  }, []);
  
  useEffect(async () => {
    await props.getDash();
    convertToSessions(props.sessions);
  }, [props.sessions]);
  

  if(props.total>0 && count === 0){
      const noti = setTimeout(async () => {
      window.__MUI_USE_NEXT_TYPOGRAPHY_VARIANTS__ = true;
      await props.enqueueSnackbar(`Hey Champ, You have a total progress of ${props.total} %, Good Job!`, { variant: 'info' });
    }, 4000);

    setCount(1);

    setTimeout(() => {
      clearTimeout(noti);
    },4500)
    
  }

  const variant = [
    'Primary',
    'Secondary',
    'Success',
    'Danger',
    'Warning',
    'Info',
    'Light',
    'Dark',
  ];

  const courseColor = (course) => {
    const units = [
      { id: 1, text: "Physics", color: 'warning' },
      { id: 2, text: "Mathematics", color: 'danger' },
      { id: 3, text: "Chemistry", color: 'success' },
      { id: 4, text: "Biology", color: 'primary' },
      { id: 5, text: "English", color: 'info' },
    ];

    let color;
    
    units.forEach(unit => {
      console.log(unit.text, course.name, unit.text === course.name, unit.color)
      if (unit.text === course.name) color = unit.color;
    });
    return color;
  }

  return (
    <>
    {console.log('props.total', props.total)}
      {/* <Calender data={sessions}/> */}
      <div className="calendar">
        <div style={{display: show ? 'block' : 'none'}}>
          <Calender data={sessions} />
        </div>
        <ul className="list-container">
        {props.data.length > 0 ? props.data.map((course, idx) => {
          return (
            <Card
              bg={courseColor(course)}
              key={idx}
              text={variant[idx].toLowerCase() === 'light' ? 'dark' : 'white'}
              style={{ width: '18rem' }}
              className="mb-2"
            >
              <Card.Header>{course.name.toUpperCase()}</Card.Header>
              <Card.Body>
                <Card.Title> PROGRESS : {course.progress} % </Card.Title>
                <Card.Text>
                  TOTAL HOURS : {course.hours}
                </Card.Text>
                <Card.Text>
                  HOURS SPENT : {course.spentHours}
                </Card.Text>
              </Card.Body>
            </Card>
          )
        }) : null}
        </ul>
      </div>
      {/* <Timetable/> */}
      <Fab
          color="secondary"
          className={classes.addButton}
          onClick={() => setShow(!show)}
        >
          <AddIcon />
        </Fab>
    </>
  );
};

const mapStateToProps = state => ({
  data: state.dashboard.statistics,
  total: state.dashboard.total,
  sessions: state.allSessions
});

const mapDispatchToProps = { getDash, getSessions };

export default connect(mapStateToProps, mapDispatchToProps)(withSnackbar(Dashboard));