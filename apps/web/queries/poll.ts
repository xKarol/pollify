import { getPollKey, getPollOptions } from "../hooks/use-poll";
import { getPollListKey, getPollListOptions } from "../hooks/use-poll-list";
import {
  getPollUserSelectionKey,
  getPollUserSelectionOptions,
} from "../hooks/use-poll-user-selection";
import {
  getPollVotersKey,
  getPollVotersOptions,
} from "../hooks/use-poll-voters";

export const pollKeys = {
  getPollList: getPollListKey,
  getPoll: getPollKey,
  getPollVoters: getPollVotersKey,
  getPollUserSelection: getPollUserSelectionKey,
};

export const pollOptions = {
  getPollList: getPollListOptions,
  getPoll: getPollOptions,
  getPollVoters: getPollVotersOptions,
  getPollUserSelection: getPollUserSelectionOptions,
} satisfies Record<keyof typeof pollKeys, unknown>;
