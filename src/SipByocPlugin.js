import React from 'react';
import { IncomingTaskCanvas, VERSION} from '@twilio/flex-ui';
import { FlexPlugin } from 'flex-plugin';

import CustomTaskListContainer from './components/CustomTaskList/CustomTaskList.Container';
import reducers, { namespace } from './states';
import { end } from 'iso8601-duration';

const PLUGIN_NAME = 'SipByocPlugin';

export default class SipByocPlugin extends FlexPlugin {
  constructor() {
    super(PLUGIN_NAME);
  }

  /**
   * This code is run when your plugin is being started
   * Use this to modify any UI components or attach to the actions framework
   *
   * @param flex { typeof import('@twilio/flex-ui') }
   * @param manager { import('@twilio/flex-ui').Manager }
   */
   


  init(flex, manager) {
    this.registerReducers(manager);

   
    flex.Actions.replaceAction("StartOutboundCall", (payload, original) => { 
      console.log(payload);

      let s  = "sip";
      if((payload.destination).includes(s)){
        console.log("sip domain already with payload destination---->",payload.destination);
          console.log('number to call:',payload.destination)
           let number = payload.destination.split('@')[0];
           payload.destination = number.split(":")[1];
           console.log(payload.destination, "*********** updated payload destination");
      }
      const body = {
        phone_number : payload.destination
      };
      
      const options = {
        method: 'POST',
        body: new URLSearchParams(body),
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded;charset=UTF-8'
        }
      };
      fetch('https://drab-barracuda-8971.twil.io/getCode', options)
      .then(resp => resp.text())
      .then(data => { 
        console.log(data)
        let show_number = payload.destination
        let newAttributes = {}
        if(payload.taskAttributes){
          newAttributes = payload.taskAttributes
        }
        newAttributes.to = payload.destination
        newAttributes.caller_country = data
        payload.taskAttributes = newAttributes
      
        payload.destination =  "sip:"+payload.destination+"@199.242.63.202;transport=tls;region=umatilla"
        payload.callerId = "+16269956259"
     
      console.log("updated outbound call to: ",payload);
      original(payload)

      });


     /* flex.Actions.addListener("afterStartOutboundCall", (payload, original) => { 
        console.log("////////////////////////after",payload)
        let newAttributes = {}
        if(payload.taskAttributes){
          newAttributes = payload.taskAttributes
        }
        newAttributes.outbound_to = payload.taskAttributes.to
        payload.taskAttributes = newAttributes
        original(payload)
      })*/











    /*  let s  = "sip";
        if((payload.destination).includes(s)){
         
            payload.destination =  payload.destination
            payload.callerId = "+16269956259"        
            console.log("updated outbound call to: ",payload);
            original(payload)
    
        }
        else {
              let newAttributes = {}
              if(payload.taskAttributes){
                newAttributes = payload.taskAttributes
              }
              newAttributes.to = payload.destination
              newAttributes.caller_country = 'INDIA'
              payload.taskAttributes = newAttributes
            
              payload.destination =  "sip:"+payload.destination+"@199.242.63.202;transport=tls;region=umatilla"
              payload.callerId = "+16269956259"
           
            console.log("updated outbound call to: ",payload);
            original(payload)
        }*/
    });
  
    console.log('56',`{{task}}`)
 
    manager.strings.TaskLineOutboundCallHeader = `{{task.attributes.to}}@US_Magna5`;
    manager.strings.CallParticipantCustomerName = `{{task.attributes.to}}@US_Magna5`;
    manager.strings.TaskHeaderLine = `{{task.attributes.to}}@US_Magna5`;
    manager.strings.TaskInfoPanelContent = `
    <h1>TASK CONTEXT</h1>
    <h2>Task type</h2>
    <p>{{task.channelType}}</p>
    <h2>Task created on</h2>
    <p>{{task.dateCreated}}</p>
    <h2>Task priority</h2>
    <p>{{task.priority}}</p>
    <h2>Task queue</h2>
    <p>{{task.queueName}}</p
    <h2>Task Sid</h2>
    <p>{{task.taskSid}}</p>
    <h2>Reservation Sid</h2>
    <p>{{task.sid}}</p>
    <hr />
    <h1>CUSTOMER CONTEXT</h1>
    <h2>Customer name / phone number</h2>
    <p>{{task.attributes.to}}</p>
    <h2>Country</h2>
    <p>{{task.attributes.caller_country}}</p>
    <hr />
`
  } 

  /**
   * Registers the plugin reducers
   *
   * @param manager { Flex.Manager }
   */
  registerReducers(manager) {
    if (!manager.store.addReducer) {
      // eslint: disable-next-line
      console.error(`You need FlexUI > 1.9.0 to use built-in redux; you are currently on ${VERSION}`);
      return;
    }

    manager.store.addReducer(namespace, reducers);
  }
}
