import React from 'react'
import { BrowserRouter as Router, Route } from 'react-router-dom'
import App from '../App'
import Requests from '../components/requests/requests'
import Auth from '../components/Auth/Auth'
import OmniumResults from '../components/omniumResults/omniumResults'
import Cyclists from '../components/cyclists/cyclists'
import Home from '../components/home/home'

// const handleAuthentication = (nextState, replace) => {
//   if (/access_token|id_token|error/.test(nextState.location.hash)) {
//     auth.handleAuthentication();
//   }
// }

export const makeMainRoutes = () => {
  return (
    <Router component={App}>
    <div>
    <Route path="/" render={(props) => <App {...props} />} />
    <Route path="/requests" render={(props) => <Requests {...props}/>} />
    <Route path="/login" render={(props) => <Auth {...props} />} />
    <Route path="/results" render={(props) => <OmniumResults {...props}/>} />
    <Route path="/cyclists" render={(props) => <Cyclists {...props} />} />
    <Route path="/home" render={(props) => <Home {...props} />} />
    {/* <Route path="/toyger/teams" render={(props) => ( auth.isAuthenticated() ?
        <Teams auth={auth} {...props}/> :
        <Redirect to='/home'/>)
      }/>

    <Route path="/toyger/races" render={(props) => ( auth.isAuthenticated() ?
      <Races auth={auth}  {...props}/> :
      <Redirect to='/home'/>)}
    />
    <Route path="/toyger/cyclists" render={(props) => (auth.isAuthenticated() ?
       <Cyclists auth={auth}  {...props}/> :
       <Redirect to='/home'/>)}
       />
    <Route path="/toyger/commissaires" render={(props) => (auth.isAuthenticated() ?
       <Commissaires auth={auth}  {...props}/> :
       <Redirect to='/home'/>)}
       />
    <Route path="/toyger/events/:eventID/cyclists" render={(props) =>  (auth.isAuthenticated() ?
       <Riders auth={auth}  {...props}/> :
       <Redirect to='/home'/>)
      }/>
    <Route path="/toyger/events/:eventID/stages" render={(props) =>  (auth.isAuthenticated() ?
        <Stages auth={auth}  {...props}/> :
        <Redirect to='/home'/>)
      }/>
    <Route path="/toyger/events/:eventID/sprints" render={(props) =>  (auth.isAuthenticated() ?
        <Sprints auth={auth}  {...props}/>:
        <Redirect to='/home'/>)
      }/>
    <Route path="/toyger/events/:eventId/results" render={(props) => (auth.isAuthenticated() ?
        <Results auth={auth}  {...props}/> :
        <Redirect to='/home'/>)
        }/>
    <Route path="/about"render={(props) => <About auth={auth}  {...props}/> }/>
    <Route path="/:id/edit"render={(props) => (auth.isAuthenticated() ?
       <AddForm auth={auth}  {...props}/> :
       <Redirect to='/home'/>)
       }/>
    <Route path="/contacts" render={(props) =><Contacts auth={auth}  {...props}/>}/>
    <Route path="/tt" render={(props) => <Toyger auth={auth}  {...props}/>}/>
    <Route path="/toyger/profile" render={(props) => (
            !auth.isAuthenticated() ? (
              <Redirect to="/home"/>
            ) : (
              <Profile auth={auth} {...props} />
            )
          )} />
    <Route path="/callback" render={(props) => {
      handleAuthentication(props);
      return <Callback {...props} />
    }}/> */}
    </div>
    </Router>
  );
}
