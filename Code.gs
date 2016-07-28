function onFormSubmit(e) {
 var responses = e.response.getItemResponses(),
      timestamp = e.response.getTimestamp(),
      requestType = responses[0].getResponse(),
      shortDesc = responses[1].getResponse(),
      longDesc = responses[2].getResponse() + " *(timestamp: " + timestamp + ")*",
      email = responses[3].getResponse(),
      cardLabelsList = "";
      
      labelIDs = {
        userFeedback: PropertiesService.getScriptProperties().getProperty("userFeedbackLabelID"),
        responseRequested: PropertiesService.getScriptProperties().getProperty("responseRequestedLabelID"),
        bug: PropertiesService.getScriptProperties().getProperty("bugLabelID"),
        featureRequest: PropertiesService.getScriptProperties().getProperty("featureRequestLabelID"),
        supportRequest: PropertiesService.getScriptProperties().getProperty("supportRequestLabelID")
      }
      
      cardLabelsList += labelIDs.userFeedback;
      
     //if an email was given, add a label indicating that a response to this request is necessary
     if (email) {
       cardLabelsList = "," + labelIDs.responseRequested; //response requested label; the comma before the label is necessary because this will always be the second label added (assuming the label is necessary)
     }
     
     
     //add the appropriate label for the request type given
     switch (requestType) {
       case "Bug":
         cardLabelsList += "," + labelIDs.bug; //bug label; see reason for the comma preceding the ID above
         break;
       case "Feature request":
         cardLabelsList += "," + labelIDs.featureRequest; //feature request label; see reason for the comma preceding the ID above
         break;
       case "Support request":
         cardLabelsList += "," + labelIDs.supportRequest; //support request label; see reason for the comma preceding the ID above
         break;
     }
      
     var trelloInfo = {
       key: PropertiesService.getScriptProperties().getProperty("key"),
       token: PropertiesService.getScriptProperties().getProperty("token"),
       listID: PropertiesService.getScriptProperties().getProperty("listID")
     }
     
     var payload = { "name": shortDesc,
                 "pos":"bottom",
                 "idList": trelloInfo.listID,
                 "idLabels": cardLabelsList,
                 "desc": longDesc} ;

   var url = "https://api.trello.com/1/cards?key=" + trelloInfo.key + "&token=" + trelloInfo.token,
        options = { "method":"post",
                    "payload":payload };
   
   try {
     UrlFetchApp.fetch(url, options);
   } catch (error) {
     SpreadsheetApp.openById("DEBUG_SPREADSHEET_ID_HERE").getSheetByName("Feedback Log").appendRow([timestamp,error])
   }
}
