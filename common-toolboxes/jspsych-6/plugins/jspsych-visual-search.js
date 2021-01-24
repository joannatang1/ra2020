/**
 *
 * jspsych-visual-search-circle
 * Josh de Leeuw
 *
 * display a set of objects, with or without a target, equidistant from fixation
 * subject responds to whether or not the target is present
 *
 * based on code written for psychtoolbox by Ben Motz
 *
 * documentation: docs.jspsych.org
 *
 **/

jsPsych.plugins["visual-search"] = (function() {

  var plugin = {};

  jsPsych.pluginAPI.registerPreload('visual-search', 'target', 'image');
  jsPsych.pluginAPI.registerPreload('visual-search', 'foil', 'image');
  jsPsych.pluginAPI.registerPreload('visual-search', 'fixation_image', 'image');

  plugin.info = {
    name: 'visual-search',
    description: '',
    parameters: {
      target: {
        type: jsPsych.plugins.parameterType.IMAGE,
        pretty_name: 'Target',
        default: undefined,
        description: 'The image to be displayed.'
      },
      foil: {
        type: jsPsych.plugins.parameterType.IMAGE,
        pretty_name: 'Foil',
        default: undefined,
        description: 'Path to image file that is the foil/distractor.'
      },
      //change to html?
      fixation: {
        type: jsPsych.plugins.parameterType.HTML_STRING,
        pretty_name: 'Fixation',
        default: '<div style="font-size: 60px;">+</div>',
        description: 'Fixation cross HTML.'
      },
      set_size: {
        type: jsPsych.plugins.parameterType.INT,
        pretty_name: 'Set size',
        default: undefined,
        description: 'How many items should be displayed?'
      },
      target_high_frequency: {
        type: jsPsych.plugins.parameterType.BOOL,
        pretty_name: 'Target has high frequency',
        default: true,
        description: 'Spacial frequency of target?'
      },
      target_size: {
        type: jsPsych.plugins.parameterType.INT,
        pretty_name: 'Target size',
        array: true,
        default: [50, 50],
        description: 'Two element array indicating the height and width of the search array element images.'
      },
      fixation_size: {
        type: jsPsych.plugins.parameterType.INT,
        pretty_name: 'Fixation size',
        array: true,
        default: [16, 16],
        description: 'Two element array indicating the height and width of the fixation image.'
      },
      circle_diameter: {
        type: jsPsych.plugins.parameterType.INT,
        pretty_name: 'Circle diameter',
        default: 250,
        description: 'The diameter of the search array circle in pixels.'
      },
      high_frequency_key: {
        type: jsPsych.plugins.parameterType.KEYCODE,
        pretty_name: 'High frequency key',
        default: 'j',
        description: 'The key to press if the target high frequency in the search array.'
      },
      low_frequency_key: {
        type: jsPsych.plugins.parameterType.KEYCODE,
        pretty_name: 'Low frequency key',
        default: 'f',
        description: 'The key to press if the target is low frequency in the search array.'
      },
      escape_key: {
        type: jsPsych.plugins.parameterType.KEYCODE,
        pretty_name: 'Escape key',
        default: 27,
        description: 'The key to press if wish to exit early and save data.'
      },
      trial_duration: {
        type: jsPsych.plugins.parameterType.INT,
        pretty_name: 'Trial duration',
        default: null,
        description: 'The maximum duration to wait for a response.'
      },
      fixation_duration: {
        type: jsPsych.plugins.parameterType.INT,
        pretty_name: 'Fixation duration',
        default: 1000,
        description: 'How long to show the fixation image for before the search array (in milliseconds).'
      }
    }
  }

  plugin.trial = function(display_element, trial) {

    // circle params
    var diam = trial.circle_diameter; // pixels
    var radi = diam / 2;
    var paper_size = diam + trial.target_size[0];

    // stimuli width, height
    var stimh = trial.target_size[0];
    var stimw = trial.target_size[1];
    var hstimh = stimh / 2;
    var hstimw = stimw / 2;

    // fixation location
    var fix_loc = [Math.floor(paper_size / 2 - trial.fixation_size[0] / 2), Math.floor(paper_size / 2 - trial.fixation_size[1] / 2)];

    // possible stimulus locations on the circle
    var display_locs = [];
    var possible_display_locs = trial.set_size;
    var random_offset = Math.floor(Math.random() * 360);
    for (var i = 0; i < possible_display_locs; i++) {
      display_locs.push([
        Math.floor(paper_size / 2 + (cosd(random_offset + (i * (360 / possible_display_locs))) * radi) - hstimw),
        Math.floor(paper_size / 2 - (sind(random_offset + (i * (360 / possible_display_locs))) * radi) - hstimh)
      ]);
    }

    // get target to draw on
    display_element.innerHTML += '<div id="jspsych-visual-search-container" style="position: relative; width:' + paper_size + 'px; height:' + paper_size + 'px"></div>';
    var paper = display_element.querySelector("#jspsych-visual-search-container");

    // check distractors - array?
    if(!Array.isArray(trial.foil)){
      fa = [];
      for(var i=0; i<trial.set_size; i++){
        fa.push(trial.foil);
      }
      trial.foil = fa;
    }

    show_fixation();

    function show_fixation() {
      // show fixation
      //var fixation = paper.image(trial.fixation, fix_loc[0], fix_loc[1], trial.fixation_size[0], trial.fixation_size[1]);
      //paper.innerHTML += "<img src='"+trial.fixation_image+"' style='position: absolute; top:"+fix_loc[0]+"px; left:"+fix_loc[1]+"px; width:"+trial.fixation_size[0]+"px; height:"+trial.fixation_size[1]+"px;'></img>";
      paper.innerHTML += '<div style="font-size: 60px;  position: absolute; top:' + (fix_loc[0] - 1) + 'px; left:' + (fix_loc[1] - 5) + 'px; ">+</div>'

      // wait
      jsPsych.pluginAPI.setTimeout(function() {
        // after wait is over
        show_search_array();
      }, trial.fixation_duration);
    }

    function show_search_array() {

      var search_array_images = [];

      var to_present = [];
      
      to_present.push(trial.target);
      to_present = to_present.concat(trial.foil);

      for (var i = 0; i < display_locs.length; i++) {

        paper.innerHTML += "<img src='"+to_present[i]+"' style='position: absolute; top:"+display_locs[i][0]+"px; left:"+display_locs[i][1]+"px; width:"+trial.target_size[0]+"px; height:"+trial.target_size[1]+"px;'></img>";

      }

      var trial_over = false;

      var after_response = function(info) {

        trial_over = true;

        var correct = false;

        if (jsPsych.pluginAPI.compareKeys(info.key,trial.high_frequency_key) && trial.target_high_frequency ||
            jsPsych.pluginAPI.compareKeys(info.key,trial.low_frequency_key) && !trial.target_high_frequency) {
          correct = true;
        }

        if(jsPsych.pluginAPI.compareKeys(info.key,trial.escape_key)){
          return jsPsych.data.displayData();
        }

        clear_display();

        end_trial(info.rt, correct, info.key);

      }

      var valid_keys = [trial.high_frequency_key, trial.low_frequency_key, trial.escape_key];

      key_listener = jsPsych.pluginAPI.getKeyboardResponse({
        callback_function: after_response,
        valid_responses: valid_keys,
        rt_method: 'performance',
        persist: false,
        allow_held_key: false
      });

      if (trial.trial_duration !== null) {

        jsPsych.pluginAPI.setTimeout(function() {

          if (!trial_over) {

            jsPsych.pluginAPI.cancelKeyboardResponse(key_listener);

            trial_over = true;

            var rt = null;
            var correct = 0;
            var key_press = null;

            clear_display();

            end_trial(rt, correct, key_press);
          }
        }, trial.trial_duration);

      }

      function clear_display() {
        display_element.innerHTML = '';
      }
    }


    function end_trial(rt, correct, key_press) {

      // data saving
      var trial_data = {
        correct: correct,
        rt: rt,
        key_press: key_press,
        locations: JSON.stringify(display_locs),
        target_high_frequency: trial.high_frequency,
        set_size: trial.set_size,
        target: trial.target,
        foils: trial.foil
      };

      // go to next trial
      jsPsych.finishTrial(trial_data);
    }
  };

  // helper function for determining stimulus locations

  function cosd(num) {
    return Math.cos(num / 180 * Math.PI);
  }

  function sind(num) {
    return Math.sin(num / 180 * Math.PI);
  }

  return plugin;
})();
