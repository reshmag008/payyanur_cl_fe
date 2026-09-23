import { useState } from 'react';
import { User, MapPin, Crosshair, Target, Pencil, Trash2,Phone } from 'lucide-react';
import { Player } from '@/types/player';
import { Button } from '@/components/ui/button';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import PlayerForm from './PlayerForm';
import { usePlayer } from '@/context/PlayerContext';
import { toast } from 'sonner';

interface PlayerCardProps {
  player: Player;
}

const PlayerCard = ({ player }: PlayerCardProps) => {
  const { deletePlayer } = usePlayer();
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [showEditDialog, setShowEditDialog] = useState(false);

  const handleDelete = () => {
    deletePlayer(player.id);
    toast.success('Player deleted successfully!');
    setShowDeleteDialog(false);
  };

  const getRoleBadgeColor = (role: string) => {
    switch (role) {
      case 'Batsman':
        return 'bg-secondary text-secondary-foreground';
      case 'Bowler':
        return 'bg-primary text-primary-foreground';
      case 'All-Rounder':
        return 'bg-pitch-dark text-primary-foreground';
      case 'Wicket-Keeper':
      case 'Wicket-Keeper Batsman':
        return 'bg-gold-dark text-primary-foreground';
      default:
        return 'bg-muted text-muted-foreground';
    }
  };

  return (
    <>
      
<div className="group bg-card rounded-2xl border border-border overflow-hidden shadow-md hover:shadow-xl transition-all duration-300">

  {/* Player Image */}
  <div className="relative h-52 sm:h-64 bg-gradient-to-br from-indigo-500/20 via-purple-500/10 to-pink-500/20 flex items-center justify-center overflow-hidden">

    {player.profile_image ? (
      <img
        src={`https://storage.googleapis.com/rajas_pl/${player.profile_image}`}
        alt={player.fullname}
        className="w-full h-full object-contain p-2 transition-transform duration-300 group-hover:scale-[1.02]"
      />
    ) : (
      <div className="w-full h-full flex items-center justify-center">
        <div className="w-24 h-24 rounded-full bg-gradient-to-br from-indigo-500/20 to-purple-500/20 flex items-center justify-center">
          <User className="w-14 h-14 text-indigo-400/60" />
        </div>
      </div>
    )}

    {/* Bottom gradient */}
    <div className="absolute inset-x-0 bottom-0 h-24 bg-gradient-to-t from-black/70 via-black/20 to-transparent pointer-events-none" />

    {/* Player Number */}
    <div className="
      absolute top-3 left-3
      w-10 h-10
      rounded-full
      bg-gradient-to-br from-indigo-600 to-purple-600
      text-white
      flex items-center justify-center
      text-sm font-bold
      shadow-lg
      border border-white/20
    ">
      {player.id}
    </div>

    {/* Role Badge */}
    <div
      className={`
        absolute top-3 right-3
        px-3 py-1.5
        rounded-full
        text-[11px]
        font-bold
        shadow-lg
        backdrop-blur-sm
        border border-white/20
        ${getRoleBadgeColor(player.player_role)}
      `}
    >
      {player.player_role}
    </div>

    {/* Player Name */}
    <div className="absolute bottom-3 left-4 right-4">
      <h3 className="
        font-heading
        font-bold
        text-lg sm:text-xl
        text-white
        truncate
        drop-shadow-lg
      ">
        {player.fullname}
      </h3>
    </div>
  </div>


  {/* Player Details */}
  <div className="p-4 sm:p-5">

    {/* Location */}
    {player.location && (
      <div className="
        flex items-center gap-3
        rounded-xl
        px-3 py-2.5
        mb-2
        bg-gradient-to-r from-blue-500/10 to-cyan-500/10
        border border-blue-500/15
      ">
        <div className="
          w-8 h-8
          rounded-lg
          bg-blue-500
          flex items-center justify-center
          flex-shrink-0
          shadow-sm
        ">
          <MapPin className="w-4 h-4 text-white" />
        </div>

        <div className="min-w-0">
          <p className="text-[9px] uppercase tracking-wider text-blue-600 dark:text-blue-400 font-bold">
            Location
          </p>
          <span className="text-sm text-foreground font-medium truncate block">
            {player.location}
          </span>
        </div>
      </div>
    )}


    {/* Contact Number */}
    {player.contact_no && (
      <div className="
        flex items-center gap-3
        rounded-xl
        px-3 py-2.5
        mb-4
        bg-gradient-to-r from-emerald-500/10 to-green-500/10
        border border-emerald-500/15
      ">
        <div className="
          w-8 h-8
          rounded-lg
          bg-emerald-500
          flex items-center justify-center
          flex-shrink-0
          shadow-sm
        ">
          <Phone className="w-4 h-4 text-white" />
        </div>

        <div className="min-w-0">
          <p className="text-[9px] uppercase tracking-wider text-emerald-600 dark:text-emerald-400 font-bold">
            Contact
          </p>
          <span className="text-sm text-foreground font-medium truncate block">
            {player.contact_no}
          </span>
        </div>
      </div>
    )}


    {/* Player Attributes */}
    <div className="grid grid-cols-2 gap-3">

      {/* Batting */}
      {player.batting_style && (
        <div className="
          relative overflow-hidden
          rounded-xl
          p-3
          bg-gradient-to-br from-orange-500 to-red-500
          text-white
          shadow-md
          shadow-orange-500/20
        ">

          {/* Decorative circle */}
          <div className="
            absolute -right-5 -top-5
            w-16 h-16
            rounded-full
            bg-white/10
          " />

          <div className="relative z-10">
            <div className="
              w-8 h-8
              rounded-lg
              bg-white/20
              flex items-center justify-center
              mb-2
            ">
              <Crosshair className="w-4 h-4" />
            </div>

            <p className="text-[9px] uppercase tracking-wider text-white/70 font-bold">
              Batting
            </p>

            <p className="text-xs sm:text-sm font-bold truncate mt-0.5">
              {player.batting_style}
            </p>
          </div>
        </div>
      )}


      {/* Bowling */}
      {player.bowling_style &&
        player.bowling_style !== "None" && (
          <div className="
            relative overflow-hidden
            rounded-xl
            p-3
            bg-gradient-to-br from-violet-500 to-purple-600
            text-white
            shadow-md
            shadow-purple-500/20
          ">

            {/* Decorative circle */}
            <div className="
              absolute -right-5 -top-5
              w-16 h-16
              rounded-full
              bg-white/10
            " />

            <div className="relative z-10">
              <div className="
                w-8 h-8
                rounded-lg
                bg-white/20
                flex items-center justify-center
                mb-2
              ">
                <Target className="w-4 h-4" />
              </div>

              <p className="text-[9px] uppercase tracking-wider text-white/70 font-bold">
                Bowling
              </p>

              <p className="text-xs sm:text-sm font-bold truncate mt-0.5">
                {player.bowling_style}
              </p>
            </div>
          </div>
        )}

    </div>

  </div>
</div>



      {/* Delete Confirmation Dialog */}
      <AlertDialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
        <AlertDialogContent className="bg-card border-2 border-border max-w-[90vw] sm:max-w-lg">
          <AlertDialogHeader>
            <AlertDialogTitle className="font-heading">Delete Player?</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete <strong>{player.fullname}</strong>? This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter className="flex-col sm:flex-row gap-2">
            <AlertDialogCancel className="border-2">Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDelete}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* Edit Dialog */}
      <Dialog open={showEditDialog} onOpenChange={setShowEditDialog}>
        <DialogContent className="bg-card border-2 border-border max-w-[95vw] sm:max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="font-heading text-lg sm:text-xl">Edit Player</DialogTitle>
          </DialogHeader>
          <PlayerForm editPlayer={player} onCancel={() => setShowEditDialog(false)} />
        </DialogContent>
      </Dialog>
    </>
  );
};

export default PlayerCard;
