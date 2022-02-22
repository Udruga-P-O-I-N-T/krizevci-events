import { ArrowSmDownIcon, LocationMarkerIcon } from "@heroicons/react/solid";
import { LoaderFunction, useLoaderData } from "remix";
import { gql, GraphQLClient } from "graphql-request";
import { isToday, isTomorrow, isPast, isFuture } from "date-fns";
import clsx from "clsx";

type Person = {
  name?: string | null;
};

type Location = {
  name?: string | null;
};

type Event = {
  id: string;
  name?: string | null;
  image?: string | null;
  description?: string | null;
  startDate?: string | null;
  endDate?: string | null;
  location?: Location | null;
  organizer?: Person | null;
  url?: string | null;
};

const query = gql`
  query Events {
    events {
      id
      name
      image
      description
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
  if (!event.startDate) {
    console.warn("Missing start date:", event);
    return null;
  }

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
    <li
      key={event.id}
      className={clsx(
        "mb-4 rounded-xl px-4 py-4 sm:px-6 flex flex-col sm:flex-row justify-between",
        isTodayEvent && "bg-green-50",
        isTomorrowEvent && "bg-yellow-50",
        !(isTodayEvent || isTomorrowEvent) && "bg-stone-50"
      )}
    >
      <div className="flex flex-col">
        <p className="text-base font-light text-gray-600 mb-1">
          {event.organizer?.name ?? ""}
        </p>
        <h1 className="text-base font-bold tracking-tight">
          {event.url ? (
            <a href={event.url} className="text-blue-800">
              {event.name}
            </a>
          ) : (
            event.name
          )}
        </h1>
        {event.location?.name && (
          <p className="mt-4 flex items-center text-sm text-gray-600">
            <LocationMarkerIcon
              className="flex-shrink-0 mr-1.5 h-5 w-5 text-gray-400"
              aria-hidden="true"
            />
            {event.location.name}
          </p>
        )}
      </div>
      <div className="flex flex-col sm:items-end sm:ml-8 mt-4 sm:mt-0">
        <div className="mb-3 sm:mb-4 flex-shrink-0 flex">
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
        <div className="flex flex-col sm:items-end text-sm text-gray-600 truncate">
          <time dateTime={event.startDate ?? ""}>{formattedStartDate}</time>
          {formattedEndDate && (
            <>
              <ArrowSmDownIcon className="h-4 w-4 text-gray-600" />
              <time dateTime={event.endDate ?? ""}>{formattedEndDate}</time>
            </>
          )}
        </div>
      </div>
    </li>
  );
}

export default function EventList() {
  const events = useLoaderData<LoaderData>();

  return (
    <main className="overflow-hidden sm:rounded-md container mx-auto max-w-screen-lg px-4">
      <ul role="list">
        {events.map((event) => (
          <Event key={event.id} event={event} />
        ))}
      </ul>
    </main>
  );
}
