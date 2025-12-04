import { HttpGetClient } from "@/infra/http";
import axios from "axios";

jest.mock("axios");

class AxiosHttpClient {
  async get(params: HttpGetClient.Params): Promise<void> {
    await axios.get(params.url, { params: params.params });
  }
}

describe("AxiosClient", () => {
  let sut: AxiosHttpClient;
  let fakeAxios: jest.Mocked<typeof axios>;
  let url: string;
  let params: Record<string, string>;
  beforeAll(() => {
    fakeAxios = axios as jest.Mocked<typeof axios>;
    url = "any_url";
    params = { any: "any" };
  });
  beforeEach(() => {
    sut = new AxiosHttpClient();
  });
  describe("get", () => {
    it("should call get with correct params", async () => {
      fakeAxios.get.mockResolvedValueOnce(undefined as never);
      await sut.get({
        url,
        params,
      });
      expect(fakeAxios.get).toHaveBeenCalledWith(url, {
        params,
      });
      expect(fakeAxios.get).toHaveBeenCalledTimes(1);
    });
  });
});
