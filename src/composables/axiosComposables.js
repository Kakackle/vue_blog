import { ref } from "vue";
import axios from "axios";
import { useToast } from "vue-toastification";
const toast = useToast();

export async function getDataFromLink(link) {
  const data = ref();
  await axios
    .get(link)
    .then((response) => {
      data.value = response.data;
    })
    .catch((error) => {
      console.log(error);
    });
  return data;
}

// TODO: czemu niby odbieranie z destrukturyzacja mialoby nie dzialc z axiosem?
// przeciez zwracac powinno tylko jak przejdzie przez wszystko?
// czy raczej albo zrobic await data = get
// lub robic return w .then zeby bylo tylko po skonczeniu
export function getDataWithSuccess(link) {
  const data = ref();
  const success = ref(false);
  const errorMsg = ref("");
  axios
    .get(link)
    .then((response) => {
      data.value = response.data;
      success.value = true;
    })
    .catch((error) => {
      console.log(error);
      success.value = false;
      errorMsg.value = error;
    });
  return { data, success, errorMsg };
}

const getConfig = {
  headers: {},
  method: "get",
};

const postConfig = {
  headers: {
    "Content-Type": "multipart/form-data",
  },
  method: "post",
};

const patchConfig = {
  headers: {
    "Content-Type": "multipart/form-data",
  },
  method: "patch",
};

/**
 *
 * @param {String} url - API endpoint in string format
 * @returns
 */
export async function getFromAPI(url) {
  return await axios({
    ...getConfig,
    url: url,
  })
    .then((res) => {
      console.log(`GET success: ${url}`);
      const success = res.status + " " + res.statusText;
      toast.success(`GET ${url}: ${success}`);
      return {
        status: res.status,
        data: res.data,
      };
    })
    .catch((err) => {
      console.log(err);
      console.log("what the fuck");
      console.log(`GET error: ${url}`);
      const error = err.status + " " + err.statusText;
      toast.error(`GET ${url}: ${error}`);
      return {
        status: err.status,
        data: err.response,
      };
    });
}

/**
 * @param {String} query_string - endpoint with or without queries applied
 * @returns {Object} {posts, pages, status} response object
 */
export async function getPostsPaginated(query_string){
    let pages = [];
    let posts = [];
    let status = '';
    getFromAPI(query_string).then((res) => {
        if (res.status === 200) {
            posts = res.data.results;
            pages.value = res.data.context.page_links;
            status = res.status
        } else {
            status = res.status;
        }
    })
    return {pages, posts, status}
}

/**
 *
 * @param {String} url - API endpoint
 * @param {Object} data - data object to be sent
 * @returns
 */
export async function postToAPI(url, data) {
  return await axios({
    ...postConfig,
    url: url,
    data: data,
  })
    .then((res) => {
      console.log(`POST success: ${url}`);
      const success = res.status + " " + res.statusText;
      toast.success(`POST ${url}: ${success}`);
      return {
        status: res.status,
        data: res.data,
      };
    })
    .catch((err) => {
      console.log(`POST error: ${url}`);
      const error = err.status + " " + err.statusText;
      toast.error(`POST ${url}: ${error}`);
      return {
        status: err.status,
        data: err.response,
      };
    });
}

/**
 *
 * @param {String} url - API endpoint
 * @param {Object} data - data object to be sent
 * @returns
 */
export async function patchToAPI(url, data) {
  return await axios({
    ...patchConfig,
    url: url,
    data: data,
  })
    .then((res) => {
      console.log(`PATCH success: ${url}`);
      const success = res.status + " " + res.statusText;
      toast.success(`PATCH ${url}: ${success}`);
      return {
        status: res.status,
        data: res.data,
      };
    })
    .catch((err) => {
      console.log(`PATCH error: ${url}`);
      const error = err.status + " " + err.statusText;
      toast.error(`PATCH ${url}: ${error}`);
      return {
        status: err.status,
        data: err.response,
      };
    });
}
