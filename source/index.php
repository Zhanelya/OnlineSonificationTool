<?php require_once 'header.php';?>
    <nav class="navbar navbar-inverse">
           <ul class="nav navbar-nav">
               <li class="active"><a href="index.php"><h4>Home</h4></a></li>
               <li><a href="sonification.php"><h4>Sonification</h4></a></li>
               <li><a href="contact.php"><h4>Contact</h4></a></li>
           </ul>
        </nav>
    <div class="wrapper ">
        <div class="container fluid">
            <h1>Home</h1>
            <h3>What is this project about?</h3>
            <p>
                The main goal of this project is to design a web application that would help to transform structured data into sound. 
            </p>
            <p>
                Such an application has a relatively high potential, as being online, it can be much more accessible than any desktop application that requires sophisticated installation process. 
                Additionally, this system helps to improve awareness of public about data sonification. 
                And as an interactive system, it will be more interesting for people to experiment with it and to explore further data sonification techniques.
            </p> 
            <h3>What is sonification?</h3>
            <p>
                Sonification is considered to be “any technique that uses data as input, and generates (in response to additional excitation or triggering) sound signals” (Hermann, 2008).
                This is necessary that this sound properly represents the properties and relations in the input data; the transformation has to be systematic and reproducible; the sonification system should be applicable for different data and be able to be used in repetition with the same data (Hermann, 2008).
            </p>
            <p>
                Examples of sonification are seismic waves mapped to sound waves, biomedical data that can be sonified using pitch and rhythm variations, and any other type of auditory representations of diagrammatic information. 
            </p>
            <h3>How can we use sonification?</h3>
            <p>
                Data sonification has a big potential, as there is a range of hidden opportunities in human hearing – for instance, subtle temporal resolution, pattern recognition and eyes free. 
            </p>
            <p>
                Data sonification can be used for data analysis, such as financial data analysis and medical observations; data representation; data mining; pattern detection; perception of multiple data streams in parallel; in mobile devices; for reducing cognitive load, as ears fatigue more slowly than eyes (McGee, 2009); etc.
            </p>
            <p>
                Sonification is also used in scientific visualisations, engineering analyses, aircraft cockpits and emergency services (Barrass ans Kramer, 1999).
            </p> 
            <h3>Data sonification techniques</h3>
            <p>
                There are many different approaches to realize the design of a sonification.
            </p>
            <ul>
                <li><h4>Earcons</h4></li>
                <p>
                    By earcons is understood any short musical motif using musical tones (Blattner et al., 1989). Their initial purpose was to provide feedback in a GUI (graphical user interface), for instance for signifying the completion of certain tasks. Earcons are formed with a lexicon of primitive sounds, which when combined together can produce more sophisticated meaning. An example of this can be setting a certain level of pitch, timbre or register equivalent to some concept or action, such as “file” or “deleted”, where the latter two can be combined together (Blattner et al., 1989). 
                </p>
                <p>
                    Earcons are easy to construct and produce on most of machines with already existing audio manipulation tools. They help to represent abstractly any object, as they are not obliged to correspond to the concepts that are represented by them (Barrass ans Kramer, 1999). On the other side, earcons are relatively difficult to learn, as they are illustrated by purely symbolic sounds; the more earcons are added, the slower the learning process becomes.
                </p>
                <li><h4>Auditory icons</h4></li>
                <p>
                    Auditory icons, are based on sounds mimicking real life sounds, such as water tapping or a door slamming (Gaver, 1994). Auditory icons can be seen as being analogous to visual icons, as they are rather mapping the type of data than the actual data values (McGee, 2009). For instance, an auditory icon for emptying a waste basket in a desktop GUI resembles real world sound of emptying the trash can. 
                </p>
                <p>
                    One of the advantages of auditory icons is the familiarity with everyday sounds, which makes their understanding much more intuitive. Apart from that, these real life sounds can be directly mapped considering their length or any other parameters. The main complexity of using auditory icons is mapping from pure mechanical events into virtual interface events (Barrass and Kramer, 1999). Apart from that, even though auditory icons production is a relatively trivial process, it puts a significant limit on the range of what can be represented by sound, as it is narrowed  down to only familiar sounds.
                </p>
                <li><h4>Spearcons</h4></li>
                <p>
                    Spearcons are similar to earcons and auditory icons. They are usually derived from spoken phrases, where the speed of the speech is sped up up to the point when they do not resemble speech any more (McGee, 2009). Auditory menus is an example usage of spearcons, where the menu text (for instance, “Save” or “Export File”) is converted to speech with text-to-speech software and then sped up, creating unique spearcons for each specific menu option, improving usability and performance of the interface (Walker et al., 2013).
                </p>
                <li><h4>Audification</h4></li>
                <p>
                    Audification is a direct conversion of data waveform into sound (McGee, 2009). 
                </p>
                <p>
                    Principal stages of audification are data acquisition (recording of sound), signal conditioning (audio signal processing) and sound projection/playback (Dombois and Eckel, 2011). It is also important to consider that the frequencies of the data representation must fit the audible range of 20Hz-22KHz (McGee, 2009).
                </p>
                <p>
                    This method is effectively used in seismology where the vibrations frequency is sped up to match the audible range (Hayward, 1994). This technique is also very useful in medicine, for instance stethoscope is one of the examples of early audifications; and audification of EEG and heart rate variability is becoming popular too (Dombois and Eckel, 2011).
                </p>
                <li><h4>Parameter mapping</h4></li>
                <p>
                    Parameter mapping is based on data variations, which are represented by auditory variations of such dimensions as duration, loudness, spatial position, brightness, pitch, timbre (tone) etc. (Kramer, 1994; Scaletti, 1994). In order to produce a more complex data representation, different parameters can be combined.
                </p>
                <p>
                    Parameter mapping is considered to be the most popular approach of data sonification (Barrass ans Kramer, 1999). Parameter mapping is relatively easy to produce, as it is possible to construct mappings to the variety of auditory parameters with already existing tools.
                </p>
                <li><h4>Model-Based Sonification</h4></li>
                <p>
                   In Model-Based Sonification (MBS), which is a relatively new approach, input data is mapped into an instrument or any object capable of producing sound (Hermann, 2008). It requires data presented as a virtual scenario and defined in terms of virtual physics. These defined laws can be used to gather information on how the objects react to external user excitation. This information can then be used to model the sound representation of the objects reaction, for instance, modelling the waves spreading out from a stone thrown into a water surface as a sound wave. 
                </p>
                <p>
                    One of the examples of MBS is a mass-spring data sonogram system, where the user interacts with a scatter plot representing the data and excites the model causing the waves propagate spherically through the model space, displacing individual masses (Hermann, 2011). Another example is principal curve sonification, where the data is presented in a form of a curve, and the user can hear the individual data points while exciting the model by moving along the curve (Hermann, 2011). There are also other interesting examples of MBS, such as tangible data scanning, data crystallization sonification, particle trajectory sonification and growing neural gas sonification, which can be found in Chapter 16 of Sonification Handbook (Hermann, 2011). 
                </p>
            </ul>
            <h3>Additional sources</h3>
            <ul>
                <li><a href="http://www.icad.org">icad.org</a></li>
                <li><a href="http://www.sonification.de">sonification.de</a></li>
            </ul>
        </div>
<?php require_once 'footer.php';?>