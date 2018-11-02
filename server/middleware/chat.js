import axios from 'axios';

const BASE_URL = `http://`;

export function getChannelById(data, user) {
  let headers = {
    'Auth-Token':  user.authToken,
    'Workspace-Id': data.workspace.id,
    'Workspace-Name': data.workspace.name,
    'Workspace-Subdomain': data.workspace.subdomain
   };
  return axios({
    method: 'get',
    url: `/rest/collaboration/channeldetail/${data.channelId}?page=1&size=10`,
    baseURL: `${BASE_URL}${user.domain}`,
    headers: headers
  });
}

export function newMessage(message, user) {   
  let headers = {
    'Auth-Token':  user.authToken,
    'Workspace-Id': message.workspace.id,
    'Workspace-Name': message.workspace.name,
    'Workspace-Subdomain': message.workspace.subdomain
 }; 
  return axios({
    method: 'put',
    url: '/rest/collaboration/messages',
    baseURL: `${BASE_URL}${user.domain}`,
    data: message,
    headers: headers
  });
}

export function readMessageNotify(data, user) {
  if (!data.workspace)
    return;
  let headers = {
    'Auth-Token':  user.authToken,
    'Workspace-Id': data.workspace.id,
    'Workspace-Name': data.workspace.name,
    'Workspace-Subdomain': data.workspace.subdomain
 };
  axios({
    method: 'post',
    url: '/rest/collaboration/lastmessages',
    baseURL: `${BASE_URL}${user.domain}`,
    data: data.messageInfo,
    headers: headers
  })
  .then(res => {}, err => {});
}
