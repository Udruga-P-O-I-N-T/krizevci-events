import {
  ArrowSmDownIcon,
  LocationMarkerIcon,
  UsersIcon,
} from "@heroicons/react/solid";
import { LoaderFunction, useLoaderData } from "remix";
import { gql, GraphQLClient } from "graphql-request";
import { isToday, isTomorrow, isPast, isFuture } from "date-fns";
import clsx from "clsx";

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
  url: string;
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
      url
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

function Event({ event }: { event: Event }) {
  const startDate = new Date(event.startDate);
  const endDate = event.endDate ? new Date(event.endDate) : null;

  const isTodayEvent =
    isToday(startDate) ||
    (isPast(startDate) && endDate !== null && isFuture(endDate));

  const isTomorrowEvent = isTomorrow(startDate);

  const dateFormatter = new Intl.DateTimeFormat("hr", {
    dateStyle: "full",
    timeStyle: "short",
  });

  const formattedStartDate = dateFormatter.format(startDate);
  const formattedEndDate = endDate && dateFormatter.format(endDate);

  return (
    <li key={event.id}>
      <a
        href={event.url ?? undefined}
        className={clsx(
          "block",
          isTodayEvent && "bg-green-50",
          isTomorrowEvent && "bg-yellow-50"
        )}
      >
        <div className="px-4 py-4 sm:px-6">
          <div className="flex items-center justify-between">
            <p className="text-sm font-medium text-indigo-600 truncate">
              {event.name}
            </p>
            <div className="ml-2 flex-shrink-0 flex">
              {isTodayEvent && (
                <p className="px-2 inline-flex text-xs leading-5 font-semibold rounded-md bg-green-400 text-gray-700">
                  Danas
                </p>
              )}
              {isTomorrowEvent && (
                <p className="px-2 inline-flex text-xs leading-5 font-semibold rounded-md bg-yellow-400 text-gray-700">
                  Sutra
                </p>
              )}
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
            <div className="grid justify-items-end mt-2 text-sm text-gray-500 sm:mt-0">
              <time dateTime={event.startDate}>{formattedStartDate}</time>
              {formattedEndDate && (
                <>
                  <ArrowSmDownIcon className="h-4 w-4 text-gray-500" />
                  <time className="mt-1" dateTime={event.endDate}>
                    {formattedEndDate}
                  </time>
                </>
              )}
            </div>
          </div>
        </div>
      </a>
    </li>
  );
}

export default function EventList() {
  const events = useLoaderData<LoaderData>();

  return (
    <div className="bg-white shadow overflow-hidden sm:rounded-md container mx-auto max-w-screen-lg">
      <ul role="list" className="divide-y divide-gray-200">
        {events.map((event) => (
          <Event key={event.id} event={event} />
        ))}
      </ul>
    </div>
  );
}
