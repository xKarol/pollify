import { createClient } from "@pollify/api/client";
import { apiUrls } from "@pollify/config/api-urls";
import type { Poll, Payment, User, Analytics, QR } from "@pollify/types";

import axios from "../lib/axios";

export const client = createClient(process.env.NEXT_PUBLIC_ORIGIN_URL!);
// POLL
export const createPoll: Poll.Api["createPoll"] = async (pollData) => {
  const { data } = await axios.post(apiUrls.poll.create, pollData);
  return data;
};

export const getPolls: Poll.Api["getPolls"] = async ({
  page = 1,
  limit = 10,
  orderBy,
  sortBy,
}) => {
  const { data } = await axios.get(apiUrls.poll.getAll, {
    params: {
      page,
      limit,
      orderBy,
      sortBy,
    },
  });
  return data;
};

export const getPoll: Poll.Api["getPoll"] = async (pollId) => {
  const { data } = await axios.get(apiUrls.poll.getOne(pollId));
  return data;
};

export const deletePoll: Poll.Api["deletePoll"] = async (pollId) => {
  const { data } = await axios.delete(apiUrls.poll.delete(pollId));
  return data;
};

export const votePoll: Poll.Api["votePoll"] = async (
  pollId,
  answerId,
  reCaptchaToken
) => {
  const { data } = await axios.post(apiUrls.poll.vote(pollId, answerId), {
    reCaptchaToken,
  });
  return data;
};

export const getPollVoters: Poll.Api["getPollVoters"] = async (pollId) => {
  const { data } = await axios.get(apiUrls.poll.getVoters(pollId));
  return data;
};

export const getPollUserAnswerChoice: Poll.Api["getPollUserAnswerChoice"] =
  async (pollId) => {
    const { data } = await axios.get(apiUrls.poll.getUserAnswerChoice(pollId));
    return data;
  };

// PAYMENTS
export const getPricingPlans: Payment.Api["getPricingPlans"] = async () => {
  const { data } = await axios.get(apiUrls.payment.getPricingPlans);
  return data;
};

export const createPlanCheckoutSession: Payment.Api["createPlanCheckoutSession"] =
  async (priceId, productId) => {
    const { data } = await axios.post(
      apiUrls.payment.createPlanCheckoutSession,
      {
        priceId,
        productId,
      }
    );
    return data;
  };

// USER
export const getUserPolls: User.Api["getUserPolls"] = async (params) => {
  const { data } = await axios.get(apiUrls.user.getPolls, {
    params,
  });
  return data;
};

export const getUserVotes: User.Api["getUserVotes"] = async (params) => {
  const { data } = await axios.get(apiUrls.user.getVotes, {
    params,
  });
  return data;
};

export const updateUser: User.Api["updateUser"] = async (userData) => {
  const { data } = await axios.patch(apiUrls.user.update, userData);
  return data;
};

export const deleteUser: User.Api["deleteUser"] = async () => {
  const { data } = await axios.delete(apiUrls.user.delete);
  return data;
};

// ANALYTICS

export const getAnalyticsUserPollVotes: Analytics.Api["getUserPollVotes"] =
  async (params) => {
    const { data } = await axios.get(apiUrls.analytics.userPollVotes, {
      params,
    });
    return data;
  };

export const getAnalyticsUserPollTopDevices: Analytics.Api["getUserPollTopDevices"] =
  async (params) => {
    const { data } = await axios.get(apiUrls.analytics.getUserPollTopDevices, {
      params,
    });
    return data;
  };

export const getAnalyticsUserPollTopCountries: Analytics.Api["getUserPollTopCountries"] =
  async (params) => {
    const { data } = await axios.get(
      apiUrls.analytics.getUserPollTopCountries,
      {
        params,
      }
    );
    return data;
  };

// QR CODE

export const getQRCodeImage: QR.Api["getQRCodeImage"] = async (text) => {
  const { data: buffer } = await axios.get(apiUrls.qr.getQRCode, {
    params: {
      text: encodeURIComponent(text),
    },
    responseType: "arraybuffer",
  });
  return `data:image/svg+xml;base64,${Buffer.from(buffer).toString("base64")}`;
};
