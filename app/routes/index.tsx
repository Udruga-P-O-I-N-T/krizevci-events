import {
  CalendarIcon,
  LocationMarkerIcon,
  UsersIcon,
} from "@heroicons/react/solid";
import { LoaderFunction, useLoaderData } from "remix";
import { gql, GraphQLClient } from "graphql-request";

type Person = {
  name: string;
};

type Location = {
  name: string;
};

type Event = {
  id: string;
  name: string;
  startDate: string;
  endDate: string;
  location: Location;
  organizer: Person;
};

const query = gql`
  query Events {
    events {
      id
      name
      startDate
      endDate
      location {
        name
      }
      organizer {
        name
      }
    }
  }
`;

type LoaderData = Array<Event>;

export let loader: LoaderFunction = async () => {
  const client = new GraphQLClient(
    process.env.NODE_ENV === "production"
      ? "https://krizevci-api.herokuapp.com/graphql"
      : "http://localhost:8080/graphql"
  );

  const data = await client.request(query);

  return data.events;
};

export default function List() {
  const events = useLoaderData<LoaderData>();

  return (
    <div className="bg-white shadow overflow-hidden sm:rounded-md container mx-auto max-w-screen-lg">
      <ul role="list" className="divide-y divide-gray-200">
        {events.map((event) => (
          <li key={event.id}>
            <a href="#" className="block hover:bg-gray-50">
              <div className="px-4 py-4 sm:px-6">
                <div className="flex items-center justify-between">
                  <p className="text-sm font-medium text-indigo-600 truncate">
                    {event.name}
                  </p>
                  <div className="ml-2 flex-shrink-0 flex">
                    <p className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800">
                      {event.startDate ?? ""}
                    </p>
                  </div>
                </div>
                <div className="mt-2 sm:flex sm:justify-between">
                  <div className="sm:flex">
                    <p className="flex items-center text-sm text-gray-500">
                      <UsersIcon
                        className="flex-shrink-0 mr-1.5 h-5 w-5 text-gray-400"
                        aria-hidden="true"
                      />
                      {event.organizer.name ?? ""}
                    </p>
                    <p className="mt-2 flex items-center text-sm text-gray-500 sm:mt-0 sm:ml-6">
                      <LocationMarkerIcon
                        className="flex-shrink-0 mr-1.5 h-5 w-5 text-gray-400"
                        aria-hidden="true"
                      />
                      {event.location.name ?? ""}
                    </p>
                  </div>
                  <div className="mt-2 flex items-center text-sm text-gray-500 sm:mt-0">
                    <CalendarIcon
                      className="flex-shrink-0 mr-1.5 h-5 w-5 text-gray-400"
                      aria-hidden="true"
                    />
                    <p>
                      <time dateTime={event.startDate}>{event.startDate}</time>
                    </p>
                  </div>
                </div>
              </div>
            </a>
          </li>
        ))}
      </ul>
    </div>
  );
}
