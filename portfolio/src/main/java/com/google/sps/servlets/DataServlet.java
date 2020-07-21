// Copyright 2019 Google LLC
//
// Licensed under the Apache License, Version 2.0 (the "License");
// you may not use this file except in compliance with the License.
// You may obtain a copy of the License at
//
//     https://www.apache.org/licenses/LICENSE-2.0
//
// Unless required by applicable law or agreed to in writing, software
// distributed under the License is distributed on an "AS IS" BASIS,
// WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
// See the License for the specific language governing permissions and
// limitations under the License.

package com.google.sps.servlets;

import com.google.appengine.api.datastore.DatastoreService;
import com.google.appengine.api.datastore.DatastoreServiceFactory;
import com.google.appengine.api.datastore.Entity;
import com.google.appengine.api.datastore.PreparedQuery;
import com.google.appengine.api.datastore.Query;
import com.google.gson.Gson;
import java.util.ArrayList;
import java.io.IOException;
import javax.servlet.annotation.WebServlet;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

/** Servlet that returns some example content. TODO: modify this file to handle comments data */
@WebServlet("/data")
public class DataServlet extends HttpServlet {
  ArrayList<String> messages = new ArrayList<String>();

  
  @Override
  public void doGet(HttpServletRequest request, HttpServletResponse response) throws IOException {
    response.setContentType("text/html;");
    DatastoreService datastore = DatastoreServiceFactory.getDatastoreService();
    ArrayList <String> commentsArray = new ArrayList<String>();
    Query query = new Query("Comment");
    PreparedQuery results = datastore.prepare(query);
    for(Entity entity : results.asIterable()) {
      commentsArray.add((String)(entity.getProperty("value")));
    }
    response.getWriter().println(new Gson().toJson(commentsArray));
  }
  @Override
  public void doPost(HttpServletRequest request, HttpServletResponse response) throws IOException{
    String commentValue = getParameter(request,"comment-input","");
    Entity commentEnitity = new Entity("Comment");
    commentEnitity.setProperty("value",commentValue);
    DatastoreService datastore = DatastoreServiceFactory.getDatastoreService();
    datastore.put(commentEnitity);
    response.sendRedirect("/index.html");
  }

  public String getParameter (HttpServletRequest request, String parameter, String defaultValue) {
    String value = request.getParameter(parameter);
    return value == null ? defaultValue : value;
  }
}
