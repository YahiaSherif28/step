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

package com.google.sps;

import java.util.ArrayList;
import java.util.Collection;
import java.util.Set;

public final class FindMeetingQuery {
  public Collection<TimeRange> query(Collection<Event> events, MeetingRequest request) {
    // timeIsOccupied is true if someone in the request attendees has an event in that moment
    boolean[] timeIsOccupied = new boolean[TimeRange.END_OF_DAY + 1];
    Collection<String> requestAttendees = request.getAttendees();

    for (Event event : events) {
      Set<String> eventAttendees = event.getAttendees();
      for (String requestAttendee : requestAttendees) {
        // if someone in our request is in this event,
        // make the range of the event [start,end) true in the timeIsOccupied[]
        if (eventAttendees.contains(requestAttendee)) {
          TimeRange eventRange = event.getWhen();
          for (int i = eventRange.start(); i < eventRange.end(); ++i) {
            timeIsOccupied[i] = true;
          }
          break;
        }
      }
    }
    // // timeIsOccupiedWithOptional is true if someone in the request attendees
    // // or the optional attendees has an event in that moment
    boolean[] timeIsOccupiedWithOptional = timeIsOccupied.clone();

    Collection<String> requestOptionalAttendees = request.getOptionalAttendees();
    for (Event event : events) {
      Set<String> eventAttendees = event.getAttendees();
      for (String optionalAttendee : requestOptionalAttendees) {
        // if someone in our request is in this event,
        // make the range of the event [start,end) true in the timeIsOccupiedWithOptional[]
        if (eventAttendees.contains(optionalAttendee)) {
          TimeRange eventRange = event.getWhen();
          for (int i = eventRange.start(); i < eventRange.end(); ++i) {
            timeIsOccupiedWithOptional[i] = true;
          }
          break;
        }
      }
    }
    // TimeRanges if we include the optional attendees
    Collection<TimeRange> resultWithOptional =
        findResultOfQuery(timeIsOccupiedWithOptional, request.getDuration());
    // return the timeranges that include the optional if there is any
    // otherwise return the time ranges which only include the mandatory
    if (resultWithOptional.isEmpty()) {
      return findResultOfQuery(timeIsOccupied, request.getDuration());
    } else {
      return resultWithOptional;
    }
  }

  /**
   * finds continous intervals of false in timeIsOcuppied[] with lengths greater than or equal to
   * durationOfRequest and returns them as a Collection<TimeRange>
   */
  private Collection<TimeRange> findResultOfQuery(
      boolean[] timeIsOccupied, long durationOfRequest) {
    Collection<TimeRange> result = new ArrayList<TimeRange>();
    int start = 0;
    int end = 1;
    while (end < timeIsOccupied.length) {
      if (timeIsOccupied[start]) {
        // if start is occupied move forward to search for a valid start
        start++;
        end = start + 1;
      } else if (timeIsOccupied[end]) {
        // start is not occupied (valid) but end is occupied
        // meaning that there is range of falses [start,end)
        TimeRange validRange = TimeRange.fromStartEnd(start, end, /*inclusive=*/ false);
        // check that the duration of the range found is enough for the request
        if (durationOfRequest <= validRange.duration()) {
          result.add(validRange);
        }
        start = end + 1;
        end = start + 1;
      } else {
        // !timeIsOccupied[start] && !timeIsOccupied[end]
        // start is not occupied (valid) and
        // we haven't reached the end of the interval yet
        end++;
      }
    }
    // To handle the case when a suffix of the array is false,
    // range [start,timeIsOccupied.length) is all false
    if (!timeIsOccupied[timeIsOccupied.length - 1]) {
      TimeRange validRange =
          TimeRange.fromStartEnd(start, timeIsOccupied.length, /*inclusive=*/ false);
      if (durationOfRequest <= validRange.duration()) {
        result.add(validRange);
      }
    }
    return result;
  }
}
