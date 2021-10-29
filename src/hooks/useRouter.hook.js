import {useMemo} from "react";
import {useHistory, useLocation, useParams, useRouteMatch} from "react-router";
import * as queryString from "querystring";

export function useRouter() {
    const params = useParams();
    const location = useLocation();
    const history = useHistory();
    const match = useRouteMatch();
    return useMemo(() => {
        return {
            push: history.push,
            replace: history.replace,
            pathname: location.pathname,
            query: {
                ...queryString.parse(location.search.substring(1, location.search.length)),
                ...params,
            },
            match,
            location,
            history,
        };
    }, [params, match, location, history]);
}