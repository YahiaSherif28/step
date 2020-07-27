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
import com.google.appengine.api.datastore.Query.SortDirection;
import com.google.appengine.api.users.UserService;
import com.google.appengine.api.users.UserServiceFactory;
import com.google.gson.Gson;
import java.io.IOException;
import java.util.ArrayList;
import javax.servlet.annotation.WebServlet;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

@WebServlet("/data")
public class DataServlet extends HttpServlet {

  @Override
  public void doGet(HttpServletRequest request, HttpServletResponse response) throws IOException {
    response.setContentType("text/html;");
    DatastoreService datastore = DatastoreServiceFactory.getDatastoreService();
    ArrayList<Comment> commentsArray = new ArrayList<Comment>();
    Query query = new Query("Comment").addSort("timestamp", SortDirection.DESCENDING);
    PreparedQuery results = datastore.prepare(query);
    int numberOfComments;
    try {
      numberOfComments = Integer.parseInt(getParameter(request, "numberOfComments", "0"));
    } catch (Exception e) {
      numberOfComments = 0;
    }
    for (Entity entity : results.asIterable()) {
      if (numberOfComments == 0) break;
      String value = (String) (entity.getProperty("value"));
      String email = (String) (entity.getProperty("email"));
      commentsArray.add(new Comment(value, email));
      numberOfComments--;
    }
    response.getWriter().println(new Gson().toJson(commentsArray));
  }

  @Override
  public void doPost(HttpServletRequest request, HttpServletResponse response) throws IOException {
    String commentValue = getParameter(request, "comment-input", "");
    Entity commentEnitity = new Entity("Comment");
    commentEnitity.setProperty("value", commentValue);
    commentEnitity.setProperty("timestamp", System.currentTimeMillis());

    UserService userService = UserServiceFactory.getUserService();
    String email = userService.getCurrentUser().getEmail();
    commentEnitity.setProperty("email", email);

    DatastoreService datastore = DatastoreServiceFactory.getDatastoreService();
    datastore.put(commentEnitity);
    response.sendRedirect("/index.html");
  }

  public String getParameter(HttpServletRequest request, String parameter, String defaultValue) {
    String value = request.getParameter(parameter);
    return value == null ? defaultValue : value;
  }

  static class Comment {
    String value;
    String email;

    public Comment(String value, String email) {
      this.value = value;
      this.email = email;
    }
  }
}
